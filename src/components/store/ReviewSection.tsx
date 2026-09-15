import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { Review } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface ReviewSectionProps {
  productId: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{ avg_rating: number; total_reviews: number }>({ avg_rating: 5.0, total_reviews: 0 });
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchReviews = () => {
    setLoading(true);
    api.getProductReviews(productId)
      .then(res => {
        if (res.success) {
          setReviews(res.reviews || []);
          if (res.stats) setStats(res.stats);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please write your review comment.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitReview({
        product_id: productId,
        rating,
        comment,
        user_name: user ? user.name : (userName || 'Verified Customer')
      });

      if (res.success) {
        showToast(res.message, 'success');
        setComment('');
        fetchReviews();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Overview Rating Stats */}
      <div className="bg-white/70 border border-syvora-border p-6 sm:p-8 rounded-3xl shadow-soft grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-syvora-border pb-6 md:pb-0 md:pr-6">
          <div className="font-serif text-5xl font-bold text-syvora-charcoal">
            {stats.avg_rating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center md:justify-start text-amber-400 gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(stats.avg_rating) ? 'fill-amber-400' : 'text-stone-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-syvora-muted font-medium">
            Based on {stats.total_reviews} verified customer reviews
          </p>
        </div>

        {/* Rating breakdown bars */}
        <div className="md:col-span-2 space-y-2 text-xs">
          {[5, 4, 3, 2, 1].map(starCount => {
            const count = reviews.filter(r => r.rating === starCount).length;
            const percent = stats.total_reviews > 0 ? Math.round((count / stats.total_reviews) * 100) : starCount === 5 ? 90 : 10;

            return (
              <div key={starCount} className="flex items-center gap-3">
                <span className="w-12 text-syvora-charcoal font-semibold flex items-center gap-1">
                  {starCount} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 bg-syvora-champagne/60 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-syvora-rose h-2.5 rounded-full transition-all" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-10 text-right text-syvora-muted">{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="bg-syvora-champagne/30 border border-syvora-border p-6 sm:p-8 rounded-3xl space-y-4">
        <h4 className="font-serif text-lg font-bold text-syvora-charcoal flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-syvora-rose" /> Leave a Product Review
        </h4>
        <p className="text-xs text-syvora-muted">
          Share your beauty experience with the Syvora community. Your honest feedback helps others!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Star Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
              Your Rating:
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-400 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating) ? 'fill-amber-400' : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {!user && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                Your Name:
              </label>
              <input
                type="text"
                placeholder="e.g. Sophia T."
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full max-w-md bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl px-4 py-2.5 border border-syvora-border outline-none focus:border-syvora-rose"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
              Your Review:
            </label>
            <textarea
              rows={4}
              placeholder="Tell us what you liked about the formula, scent, texture, or results..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl p-4 border border-syvora-border outline-none focus:border-syvora-rose"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Submit Verified Review
          </button>
        </form>
      </div>

      {/* Customer Review List */}
      <div className="space-y-4">
        <h4 className="font-serif text-xl font-bold text-syvora-charcoal">
          Customer Reviews ({reviews.length})
        </h4>

        {loading ? (
          <div className="text-center py-8 text-xs text-syvora-muted">Loading customer reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-xs text-syvora-muted bg-white/50 rounded-2xl border border-syvora-border">
            Be the first to review this product!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(rev => (
              <div key={rev.id} className="bg-white/70 border border-syvora-border/60 p-5 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-syvora-charcoal">{rev.user_name}</span>
                    {Boolean(rev.verified_purchase) && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-syvora-muted">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-syvora-charcoal/90 leading-relaxed pt-1">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
