import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../utils/utils';

function CourseDetailsWithReviews() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [newReview, setNewReview] = useState({ rating: 5, review: '' });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  useEffect(() => {
    fetchCourse();
    fetchReviews();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/course/${courseId}`);
      setCourse(res.data.course);
    } catch {
      toast.error('Failed to load course details');
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/review/course/${courseId}`);
      setReviews(res.data.reviews);
      setStats(res.data.stats);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to submit a review');
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/review/create/${courseId}`,
        newReview,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review submitted!');
      setNewReview({ rating: 5, review: '' });
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    }
  };

  const StarRating = ({ rating, setRating, interactive = false }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`text-xl sm:text-2xl transition-transform duration-200 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:scale-125' : ''}`}
          onClick={() => interactive && setRating(star)}
        />
      ))}
    </div>
  );

  if (loading || !course) {
    return (
      <div className="text-center py-20 text-gray-400 animate-pulse text-xl">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-4"
      >
        ← Back
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
        <img
          src={course.image?.url || 'https://via.placeholder.com/300x150'}
          alt={course.title}
          className="rounded-xl shadow-lg w-full md:w-72 h-44 md:h-60 object-cover"
        />
        <div className="flex-1 space-y-3">
          <div className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
            Course
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 leading-relaxed">{course.description}</p>
          <p className="text-sm text-gray-500 font-medium">
            Instructor: <span className="text-indigo-700">{course.instructor}</span>
          </p>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">What Students Say</h2>
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold text-indigo-600">
            {stats.totalReviews > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
          </span>
          <StarRating rating={Math.round(stats.averageRating)} />
          <p className="text-gray-500 text-sm">{stats.totalReviews} reviews</p>
        </div>
      </div>

      {/* Review Form */}
      {token && (
        <form onSubmit={handleSubmitReview} className="bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-6">
          <h3 className="text-xl font-semibold text-gray-700">Leave a Review</h3>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Your Rating</label>
            <StarRating
              rating={newReview.rating}
              setRating={(rating) => setNewReview((prev) => ({ ...prev, rating }))}
              interactive
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Your Feedback</label>
            <textarea
              value={newReview.review}
              onChange={(e) => setNewReview((prev) => ({ ...prev, review: e.target.value }))}
              className="w-full p-4 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows="4"
              placeholder="Tell us about your experience..."
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-gray-800">
                {review.userId?.firstName ?? 'Deleted'} {review.userId?.lastName ?? 'User'}
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-gray-700 text-sm">{review.review}</p>
            <p className="text-xs text-gray-400 mt-3">
              {new Date(review.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseDetailsWithReviews;
