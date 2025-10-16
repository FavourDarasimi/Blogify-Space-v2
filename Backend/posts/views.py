from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, F
from django.utils.timezone import now
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Post, Category, Comment, PostView
from .serializers import (
    PostSerializer,
    CategorySerializer,
    CommentSerializer,
)
from .utils import dynamic_trending_threshold, get_time_window


# ✅ Helper for safe object retrieval
def get_object_or_404_safe(model, **kwargs):
    try:
        return model.objects.get(**kwargs)
    except ObjectDoesNotExist:
        return None


class CreatePostView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        try:
            serializer = PostSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response({
                    'message': 'Post created successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListPostView(APIView):
    def get(self, request: Request):
        try:
            posts = Post.objects.all()
            serializer = PostSerializer(posts, many=True, context={'request': request})
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DetailPostView(APIView):
    def get(self, request: Request, pk):
        post = get_object_or_404_safe(Post, pk=pk)
        if not post:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            if request.user.is_authenticated:
                user, ip = request.user, None
            else:
                user, ip = None, self.get_client_ip(request)

            try:
                PostView.objects.create(post=post, user=user, ip_address=ip)
                Post.objects.filter(pk=post.pk).update(views=F("views") + 1)
            except IntegrityError:
                pass  # already viewed

            serializer = PostSerializer(post, context={'request': request})
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        return x_forwarded_for.split(",")[0] if x_forwarded_for else request.META.get("REMOTE_ADDR")


class EditPost(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request: Request, pk):
        post = get_object_or_404_safe(Post, pk=pk)
        if not post:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        if post.user != request.user:
            raise PermissionDenied("You are not allowed to edit this post.")

        try:
            serializer = PostSerializer(post, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateCategoryView(APIView):
    def post(self, request: Request):
        try:
            serializer = CategorySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Category created successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CategoryView(APIView):
    def get(self, request: Request):
        try:
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CategoryPostView(APIView):
    def get(self, request: Request, pk):
        category = get_object_or_404_safe(Category, pk=pk)
        if not category:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            posts = Post.objects.filter(category__pk=pk)
            serializer = PostSerializer(posts, many=True, context={'request': request})
            return Response({
                'data': serializer.data,
                'category_data': CategorySerializer(category).data,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, pk):
        post = get_object_or_404_safe(Post, pk=pk)
        if not post:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            serializer = CommentSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(user=request.user, post=post)
                return Response({
                    'message': f'Comment added to {post}',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListPostCommentsView(APIView):
    def get(self, request: Request, pk):
        post = get_object_or_404_safe(Post, pk=pk)
        if not post:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            comments = Comment.objects.filter(post=post).order_by('-date_added')
            serializer = CommentSerializer(comments, many=True, context={'request': request})
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request: Request, pk):
        post = get_object_or_404_safe(Post, pk=pk)
        if not post:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            if request.user in post.likes.all():
                post.likes.remove(request.user)
                message = 'Post unliked successfully'
            else:
                post.likes.add(request.user)
                message = 'Post liked successfully'

            serializer = PostSerializer(post, context={'request': request})
            return Response({'message': message, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FeaturedPostView(APIView):
    def get(self, request: Request):
        try:
            featured_posts = Post.objects.filter(featured=True)
            serializer = PostSerializer(featured_posts, many=True, context={'request': request})
            return Response({'message': 'Featured posts', 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TopPostView(APIView):
    def get(self, request: Request):
        try:
            top_posts = Post.objects.annotate(num_likes=Count('likes')).filter(num_likes__gt=0).order_by('-num_likes')
            serializer = PostSerializer(top_posts, many=True, context={'request': request})
            return Response({'message': 'Top posts', 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TrendingPostView(APIView):
    def get(self, request):
        try:
            timeframe = request.query_params.get("timeframe", "weekly").lower()
            time_window = get_time_window(timeframe)
            posts = (
                Post.objects.annotate(
                    like_count=Count("likes", distinct=True),
                    save_count=Count("saved", distinct=True),
                    comment_count=Count("comments", distinct=True),
                )
                .filter(date_added__gte=time_window)
            )

            for post in posts:
                age_in_days = max((now() - post.date_added).days, 1)
                post.trending_score = (
                    (post.views * 1)
                    + (post.likes.count() * 3)
                    + (post.comments.count() * 4)
                    + (post.saved.count() * 5)
                ) / age_in_days

            threshold = dynamic_trending_threshold(posts)
            trending_posts = [p for p in posts if p.trending_score >= threshold]
            trending_posts.sort(key=lambda p: p.trending_score, reverse=True)

            for post in trending_posts:
                post.trending = True
                post.save(update_fields=["trending"])

            serializer = PostSerializer(trending_posts, many=True, context={"request": request})
            return Response({
                "timeframe": timeframe,
                "threshold": threshold,
                "count": len(serializer.data),
                "data": serializer.data,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LatestPostView(APIView):
    def get(self, request: Request):
        try:
            latest_posts = Post.objects.order_by('-date_added')[:8]
            serializer = PostSerializer(latest_posts, many=True, context={'request': request})
            return Response({'message': 'Latest posts', 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RelatedPostsView(APIView):
    def get(self, request: Request, pk):
        post = get_object_or_404_safe(Post, pk=pk)
        if not post:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            related_posts = Post.objects.filter(category=post.category).exclude(id=post.id).order_by('?')[:6]
            serializer = PostSerializer(related_posts, many=True, context={'request': request})
            return Response({'message': 'Related posts', 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SavePostView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request: Request, pk):
        post = get_object_or_404_safe(Post, pk=pk)
        if not post:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            if request.user in post.saved.all():
                post.saved.remove(request.user)
                message = 'Post unsaved successfully'
            else:
                post.saved.add(request.user)
                message = 'Post saved successfully'

            serializer = PostSerializer(post, context={'request': request})
            return Response({'message': message, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SavedPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        try:
            saved_posts = Post.objects.filter(saved=request.user)
            serializer = PostSerializer(saved_posts, many=True, context={'request': request})
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
