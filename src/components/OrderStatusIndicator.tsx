import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // For conditional class names

export type OrderStatus =
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED';

interface OrderStatusIndicatorProps {
  status: OrderStatus;
  className?: string;
}

const statusStyles: Record<OrderStatus, { text: string; className: string }> = {
  PENDING_CONFIRMATION: { text: 'Pending Confirmation', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  CONFIRMED: { text: 'Confirmed', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  PREPARING: { text: 'Preparing', className: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  READY_FOR_PICKUP: { text: 'Ready for Pickup', className: 'bg-purple-100 text-purple-800 border-purple-300' },
  OUT_FOR_DELIVERY: { text: 'Out for Delivery', className: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  DELIVERED: { text: 'Delivered', className: 'bg-green-100 text-green-800 border-green-300' },
  CANCELLED: { text: 'Cancelled', className: 'bg-gray-100 text-gray-800 border-gray-300' },
  FAILED: { text: 'Failed', className: 'bg-red-100 text-red-800 border-red-300' },
};

const OrderStatusIndicator: React.FC<OrderStatusIndicatorProps> = ({ status, className }) => {
  console.log("Rendering OrderStatusIndicator with status:", status);

  const style = statusStyles[status] || { text: 'Unknown Status', className: 'bg-gray-100 text-gray-800 border-gray-300' };

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-0.5 text-xs font-semibold rounded-full border",
        style.className,
        className
      )}
    >
      {style.text}
    </Badge>
  );
};

export default OrderStatusIndicator;