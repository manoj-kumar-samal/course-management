import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import Reviews from './Reviews.jsx'
import { BACKEND_URL } from '../../utils/utils.js'

function Buy() {
    const [course, setCourse] = useState({})
    const [clientSecret, setClientSecret] = useState("")
    const [error, setError] = useState("")
    const [cardError, setCardError] = useState("")
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const user = JSON.parse(localStorage.getItem("user"))
    const token = user?.token

    const stripe = useStripe()
    const elements = useElements()

    useEffect(() => {
        const fetchBuyCourseData = async () => {
            if (!token) {
                setError("Please login to purchase the course")
                return
            }
            try {
                setLoading(true)
                const response = await axios.post(`${BACKEND_URL}/course/buy/${courseId}`, {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                )
                setCourse(response.data.course)
                setClientSecret(response.data.clientSecret)
            } catch (error) {
                if (error.response?.status === 400) {
                    setError("You have already purchased this course")
                    navigate("/purchase")
                } else {
                    toast.error(error?.response?.data?.errors || "Something went wrong")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchBuyCourseData()
    }, [courseId, token, navigate])

    const handlePurchase = async (event) => {
        event.preventDefault()

        if (!stripe || !elements) return

        setLoading(true)
        const card = elements.getElement(CardElement)

        if (!card) {
            setCardError("Card information is not available.")
            setLoading(false)
            return
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        })

        if (error) {
            setCardError(error.message)
            setLoading(false)
            return
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details: {
                    name: user?.user?.firstName,
                    email: user?.user?.email,
                },
            },
        })

        if (confirmError) {
            setCardError(confirmError.message)
        } else if (paymentIntent.status === "succeeded") {
            const paymentInfo = {
                email: user?.user?.email,
                userId: user.user._id,
                courseId,
                paymentId: paymentIntent.id,
                amount: paymentIntent.amount,
                status: paymentIntent.status,
            }

            try {
                await axios.post(`${BACKEND_URL}/order`, paymentInfo, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true,
                })
                toast.success("Payment successful!")
                navigate("/purchase")
            } catch (error) {
                console.error(error)
                toast.error("Error in making payment")
            }
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 flex items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-lg max-w-xl w-full p-8 space-y-6">
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <h2 className="text-3xl font-bold text-gray-800 text-center">
                    Complete Your Purchase
                </h2>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-3">
                    <h3 className="text-2xl font-semibold text-gray-700">
                        {course?.title || "Course Title"}
                    </h3>
                    <p className="text-lg text-gray-600">
                        Price: <span className="font-medium text-black">₹{course?.price || "—"}</span>
                    </p>
                </div>

                <form onSubmit={handlePurchase} className="space-y-4">
                    <div className="border border-gray-300 rounded-md p-4 bg-white shadow-inner">
                        <CardElement className="p-2" />
                    </div>

                    {cardError && <p className="text-red-500 text-sm">{cardError}</p>}

                    <button
                        type="submit"
                        disabled={!stripe || loading}
                        className={`w-full py-3 px-5 text-lg font-medium text-white rounded-md transition ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {loading ? "Processing..." : "Buy Now"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500">
                    Payments are securely processed via Stripe.
                </p>

                {/* Reviews Section */}
                {/* <div className="mt-8">
                    <Reviews courseId={courseId} />
                </div> */}
            </div>
        </div>
    )
}

export default Buy