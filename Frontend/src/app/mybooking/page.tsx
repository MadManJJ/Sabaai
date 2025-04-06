'use client'
import ReservationCart from "@/components/ReservationCart";
import { useSession } from "next-auth/react";

const MyBookingPage = () => {
  const session = useSession()
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">{session.data?.user.name}'s Massage Bookings</h1>
          <p className="text-emerald-600 max-w-2xl mx-auto">
            View and manage your upcoming relaxation sessions
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <ReservationCart />
        </div>
      </div>
    </main>
  )
}

export default MyBookingPage