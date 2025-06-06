import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/utils';


function CourseProgress({ courseId }) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  useEffect(() => {
    if (!token || !courseId) return;

    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/progress/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProgress(response.data.progress);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId, token]);

  const updateProgress = async (newProgress) => {
    try {
      await axios.put(
        `${BACKEND_URL}/progress/update/${courseId}`,
        { progress: newProgress },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProgress(newProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return <div>Loading progress...</div>;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      
      {/* Progress controls - for testing */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => updateProgress(Math.min(progress + 10, 100))}
          className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
        >
          +10%
        </button>
        <button
          onClick={() => updateProgress(Math.max(progress - 10, 0))}
          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
        >
          -10%
        </button>
      </div>
    </div>
  );
}

export default CourseProgress;