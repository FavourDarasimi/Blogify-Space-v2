from django.db.models import Avg, StdDev, Max
from django.utils.timezone import now, timedelta
from .models import Post
from statistics import mean, stdev


def get_time_window(timeframe: str = "weekly"):
    """
    Return datetime window for the given timeframe.
    Default is 'weekly'.
    """
    timeframes = {
        "daily": timedelta(days=1),
        "weekly": timedelta(days=7),
        "monthly": timedelta(days=30),
        "all": timedelta(days=3650),  # ~10 years, for all-time
    }
    return now() - timeframes.get(timeframe, timedelta(days=7))  # default weekly


def dynamic_trending_threshold(posts):
    """
    Compute threshold dynamically from trending_score values in the queryset.
    """
    scores = [p.trending_score for p in posts if hasattr(p, "trending_score")]

    if not scores:
        return 0  # no posts yet

    avg_score = mean(scores)
    std_score = stdev(scores) if len(scores) > 1 else 0
    max_score = max(scores)

    # Adaptive threshold
    return max(avg_score + std_score, 0.1 * max_score)
