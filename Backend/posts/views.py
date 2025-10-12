from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from .models import Post,Category,Comment,SavedPost,PostView
from .serializers import PostSerializer,CategorySerializer,CommentSerializer,SavedPostSerializer
from rest_framework.parsers import MultiPartParser,FormParser
from django.db.models import F
from django.db.models import Count, F, FloatField, ExpressionWrapper
from django.utils.timezone import now, timedelta
from .utils import dynamic_trending_threshold,get_time_window
from django.db.models.functions import Now, ExtractDay, ExtractHour


class CreatePostView(APIView):
    parser_classes = [MultiPartParser,FormParser]
    def post(self, request:Request):
        data= request.data
        serializer = PostSerializer(data=data, context={'request':request})
        if serializer.is_valid():
            
            serializer.save(user = request.user)
            response = {
                'message': 'Post created successfully',
                'data': serializer.data
            }
            return Response(data=response,status=status.HTTP_201_CREATED)
        return Response(data={'error':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class ListPostView(APIView):
    def get(self,request:Request):
        post =Post.objects.all()
        serializer = PostSerializer(post,many=True,context={'request':request})
        response = {
            'data':serializer.data
        }
        return Response(data=response,status=status.HTTP_200_OK)

class DetailPostView(APIView):
    def get(self, request:Request,pk):
        post =Post.objects.get(pk=pk)
        if request.user.is_authenticated:
            user = request.user
            ip = None
        else:
            user = None
            ip = self.get_client_ip(request)

        # Try to register a new view
        try:
            
            PostView.objects.create(post=post, user=user, ip_address=ip)
            Post.objects.filter(pk=post.pk).update(views=F("views") + 1)
        except IntegrityError:
            pass  # already viewed — d

        serializer = PostSerializer(post,context={'request':request})
        response = {
            'data':serializer.data

        }
        return Response(data=response, status=status.HTTP_200_OK) 
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0]
        return request.META.get("REMOTE_ADDR")

class EditPost(APIView):
    def put(self, request:Request,pk) :
        post = Post.objects.get(user=request.user,pk=pk)    
        data=request.data
        serializer = PostSerializer(instance=post,data=data,partial=True,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data,status=status.HTTP_200_OK)    
        return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class CreateCategoryView(APIView):
    def post(self, request:Request):
        data=request.data
        serializer = CategorySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            response = {
                'message': 'Category created successfully',
                'data': serializer.data
            }
            return Response(data=response,status=status.HTTP_201_CREATED)
        return Response(data={'error':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class CategoryView(APIView):
    def get(self, request:Request):
        category= Category.objects.all()
        serializer = CategorySerializer(category,many=True)
        response = {
            'data':serializer.data
        }
        return Response(data=response,status=status.HTTP_200_OK)

class CategoryPostView(APIView):
    def get(self,request: Request,pk):
        category = Category.objects.get(pk=pk)
        posts = Post.objects.filter(category__pk=pk)
        serializer = PostSerializer(posts,many=True,context={'request':request})
        category_serializer = CategorySerializer(category,context={'request':request})
        response = {
            'data':serializer.data,
            'category_data':category_serializer.data,
        }
        return Response(data=response,status=status.HTTP_200_OK)
        

class CreateCommentView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request:Request,pk):
        print(f"User: {request.user.id}")
        post = Post.objects.get(pk=pk)
        data= request.data
        serializer = CommentSerializer(data=data,context={'request':request})
        if serializer.is_valid():
            serializer.validated_data['post'] = post
            serializer.save(user=request.user)
            response = {
                'message':f'Coment Created on {post} Successfully',
                'data':serializer.data
            }
            return Response(data=response,status=status.HTTP_201_CREATED)
        return Response(data={'error':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class ListPostCommentsView(APIView):
    def get(self,request:Request,pk):
        post = Post.objects.get(pk=pk)
        comment = Comment.objects.filter(post=post).order_by('-date_added')
        serializer = CommentSerializer(instance=comment,many=True,context={'request':request})
        response = {
            'message':f'Comments on &{post}',
            'data': serializer.data
        }
        return Response(data=serializer.data,status=status.HTTP_200_OK)
    

class LikePostView(APIView):
    def put(self,request:Request,pk):
        post = Post.objects.get(pk=pk)
        data=request.data
        serializer = PostSerializer(instance=post,data=data,partial=True,context={'request':request})
        if serializer.is_valid():
            if request.user in post.likes.all():
                post.likes.remove(request.user)
                serializer.save()
                response = {
                    'message':'Post Unliked Successfully',
                    'data':serializer.data
                }
                return Response(data=response,status=status.HTTP_200_OK)
                
            else:
                post.likes.add(request.user.id)
                serializer.validated_data['likes'] = post.likes.all()
                serializer.save()
                response = {
                    'message':'Post Liked Successfully',
                    'data':serializer.data
                }
            return Response(data=serializer.data,status=status.HTTP_200_OK)
            
        return Response(data={'error':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class FeaturedPostView(APIView):
    def get(self,request:Request):
        featured_post = Post.objects.filter(featured=True)
        seializer = PostSerializer(featured_post,many=True,context={'request':request})
        response = {
            'message':'Featured Post',
            'data':seializer.data
        }
        return Response(data=response,status=status.HTTP_200_OK)

class TopPostView(APIView):
    def get(self,request:Request):
        top_post = Post.objects.annotate(num_likes = Count('likes')).filter(num_likes__gt=0).order_by('-num_likes')
        seializer = PostSerializer(top_post,many=True,context={'request':request})
        response = {
            'message':'Top Post',
            'data':seializer.data
        }
        return Response(data=response,status=status.HTTP_200_OK)



class TrendingPostView(APIView):
    def get(self, request):
        timeframe = request.query_params.get("timeframe", "weekly").lower()
        time_window = get_time_window(timeframe)

        # Step 1: Annotate engagement metrics
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
            trending_score = (
                (post.views * 1)
                + (post.likes.count() * 3)
                + (post.comments.count() * 4)
                + (post.saved.count() * 5)
            ) / age_in_days
            post.trending_score = trending_score

       
        threshold = dynamic_trending_threshold(posts)

        trending_posts = [p for p in posts if p.trending_score >= threshold]
        trending_posts.sort(key=lambda p: p.trending_score, reverse=True)

        for post in trending_posts:
            post.trending = True
            post.save(update_fields=["trending"])

        serializer = PostSerializer(trending_posts, many=True, context={"request": request})

        return Response(
            {
                "timeframe": timeframe,
                "threshold": threshold,
                "count": len(serializer.data),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    

class LatestPostView(APIView):
    def get(self, request:Request):
        latest_post = Post.objects.order_by('-date_added')[:8]
        serializer = PostSerializer(latest_post,many=True,context={'request':request})
        response = {
            'message':'Latest Post',
            'data':serializer.data
        }
        return Response(data=response,status=status.HTTP_200_OK)   

class RelatedPostsView(APIView):
    def get(self, request:Request,pk):
        post=Post.objects.get(pk=pk)
        posts = Post.objects.filter(category=post.category).distinct().order_by('?')
        related_post = []
        for blog_post in posts:
            if post.id == blog_post.id:
                pass
            else:
                related_post.append(blog_post )
        serializer = PostSerializer(related_post,many=True,context={"request":request}) 
        response = {
            'message':'Related Post',
            'data':serializer.data
        }
        return Response(data=response,status=status.HTTP_200_OK)  
    

class SavePostView(APIView):
    def put(self,request:Request,pk):
        post = Post.objects.get(pk=pk)
        data=request.data
        serializer = PostSerializer(instance=post,data=data,partial=True,context={'request':request})
        if serializer.is_valid():
            if request.user in post.saved.all():
                post.saved.remove(request.user)
                serializer.save()
                
                return Response(data=serializer.data,status=status.HTTP_200_OK)
                
            else:
                post.saved.add(request.user.id)
                serializer.validated_data['saved'] = post.saved.all()
                serializer.save()
 
            return Response(data=serializer.data,status=status.HTTP_200_OK)
            
        return Response(data={'error':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class SavedPostView(APIView):
    def get(self, request:Request):
        savedPost = Post.objects.filter(saved=request.user)
        serializer = PostSerializer(savedPost,many=True,context={'request':request}) 
        return Response(data=serializer.data,status=status.HTTP_200_OK)  