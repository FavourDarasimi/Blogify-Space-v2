from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from .models import Post,Category,Comment,SavedPost
from .serializers import PostSerializer,CategorySerializer,CommentSerializer,SavedPostSerializer
from rest_framework.parsers import MultiPartParser,FormParser



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
    
class PostView(APIView):
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
        serializer = PostSerializer(post,context={'request':request})
        response = {
            'Post':serializer.data

        }
        return Response(data=serializer.data, status=status.HTTP_200_OK) 

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
    

class TopPostView(APIView):
    def get(self,request:Request):
        top_post = Post.objects.annotate(num_likes = Count('likes')).filter(num_likes__gt=0).order_by('-num_likes')
        seializer = PostSerializer(top_post,many=True,context={'request':request})
        response = {
            'message':'Top Post',
            'data':seializer.data
        }
        return Response(data=response,status=status.HTTP_200_OK)


class LatestPostView(APIView):
    def get(self, request:Request):
        latest_post = Post.objects.order_by('-date_added')[:8]
        seializer = PostSerializer(latest_post,many=True,context={'request':request})
        response = {
            'message':'Latest Post',
            'data':seializer.data
        }
        return Response(data=response,status=status.HTTP_200_OK)   

class RelatedPostsView(APIView):
    def get(self, request:Request,pk):
        post=Post.objects.get(pk=pk)
        related_post = Post.objects.filter(category=post.category).distinct().order_by('?')[:5]
        serializer = PostSerializer(related_post,many=True,context={"request":request}) 
        return Response(data=serializer.data,status=status.HTTP_200_OK)  
    

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