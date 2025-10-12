from django.urls import path

from . import views


urlpatterns = [
    path('post/create',views.CreatePostView.as_view(),name='create_post'),
    path('post',views.ListPostView.as_view(),name='posts'),
    path('post/edit/<int:pk>',views.EditPost.as_view(),name='edit_post'),
    path('top/posts',views.TopPostView.as_view(),name='top_posts'),
    path('trending/posts/',views.TrendingPostView.as_view(),name='trending_posts'),
    path('featured/posts',views.FeaturedPostView.as_view(),name='featured_posts'),
    path('latest/posts',views.LatestPostView.as_view(),name='latest_posts'),
    path('category/create/',views.CreateCategoryView.as_view(),name='posts'),
    path('post/<int:pk>',views.DetailPostView.as_view(),name='detail_post'),
    path('post/related/<int:pk>',views.RelatedPostsView.as_view(),name='related_post'),
    path('comments/<int:pk>',views.ListPostCommentsView.as_view(),name='detail_post_comments'),
    path('categories',views.CategoryView.as_view(),name='categories'),
    path('category/<int:pk>/post',views.CategoryPostView.as_view(),name='category_post'),
    path('comment/create/<int:pk>',views.CreateCommentView.as_view(),name='create_coment'),
    path('likepost/<int:pk>',views.LikePostView.as_view(),name='like_post'),
    path('savepost/<int:pk>',views.SavePostView.as_view(),name='add_saved_post'),
    path('saved/post',views.SavedPostView.as_view(),name='saved_post'),

] 