'use client'
import { Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import getAllShops from "@/libs/Shops/getAllShops";
import { Shop, ShopJson, UpdateReservationDto } from "../../../../interfaces";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import updateReservation from "@/libs/Reservations/updateReservation";
import { useSession } from "next-auth/react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { updateReservation as updateReservationRedux } from "@/redux/features/cartSlice";
import { useRouter, useSearchParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const EditBookingPage = ({ params }: { params: { id: string } }) => {
  const searchParams = useSearchParams();
  const defaultShopId = searchParams.get("shopId") || null;
  const defaultDate = searchParams.get("date") || null;
  const defaultDateObj = defaultDate ? dayjs(defaultDate, "YYYY/MM/DD") : null;

  const [shops, setShops] = useState<Shop[] | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(defaultShopId || null);
  const [date, setDate] = useState<Dayjs | null>(defaultDateObj || null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const token = session?.user.token;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchShop = async () => {
      const response: ShopJson = await getAllShops();
      if (response.success) {
        setShops(response.data);
      }
    };
    fetchShop();
  }, []);

  const updateReser = async () => {
    if (!date || !selectedShopId) return;
    
    setLoading(true);
    const reservationId = params.id;
    const selectedShop = shops?.find((shop) => shop._id === selectedShopId);
    
    try {
      if (selectedShop) {
        const updateReduxBody = {
          id: reservationId,
          shop: selectedShop,
          date: dayjs(date).format("YYYY/MM/DD"),
        };
        dispatch(updateReservationRedux(updateReduxBody));
      }

      const body: UpdateReservationDto = {
        shop: selectedShopId,
        date: dayjs(date).format("YYYY/MM/DD"),
      };
      
      await updateReservation(reservationId, token, body);
      router.push("/mybooking");
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!shops) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <CircularProgress sx={{ color: '#10b981' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-emerald-100">
        <h1 className="text-2xl font-bold text-emerald-800 mb-6">Reschedule Your Session</h1>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="shop" className="block text-emerald-700 font-medium mb-2">
              Select Spa Location:
            </label>
            <Select
              id="shop-select"
              onChange={(e) => setSelectedShopId(e.target.value as string)}
              value={selectedShopId || ""}
              className="w-full bg-white text-emerald-900 rounded-lg"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#059669',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#047857',
                },
              }}
            >
              {shops.map((shop) => (
                <MenuItem 
                  key={shop._id} 
                  value={shop._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#d1fae5',
                    },
                  }}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {shop.name}
                  </div>
                </MenuItem>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-emerald-700 font-medium mb-2">
              Select New Date:
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="w-full"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#059669',
                    },
                    '&:hover fieldset': {
                      borderColor: '#047857',
                    },
                  },
                  width: '100%'
                }}
              />
            </LocalizationProvider>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition duration-300 font-medium flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              updateReser();
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              <>
                Confirm Changes
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBookingPage;