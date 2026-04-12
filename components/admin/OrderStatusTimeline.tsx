'use client';

import type { Order } from '@/lib/types';
import { cn } from '@/lib/utils';

function StepCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const STEPS = ['Order Placed', 'Processing', 'Shipped', 'Delivered'] as const;

/** Last completed step index (aligned with customer app timeline). */
function statusToStepIndex(status: Order['status']): number {
  switch (status) {
    case 'Pending':
      return 1;
    case 'Shipped':
      return 2;
    case 'Delivered':
      return 3;
    case 'Cancelled':
      return -1;
    default:
      return 1;
  }
}

export function OrderStatusTimeline({ status }: { status: Order['status'] }) {
  const activeIdx = statusToStepIndex(status);

  return (
    <div className="mt-2">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Track order
      </p>
      <div className="mt-4">
        {STEPS.map((label, i) => {
          const isLast = i === STEPS.length - 1;
          const completed = status !== 'Cancelled' && i <= activeIdx;
          const lineActive = !isLast && status !== 'Cancelled' && i < activeIdx;

          return (
            <div key={label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors',
                    completed
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-muted text-muted-foreground'
                  )}
                >
                  {completed ? (
                    <StepCheckIcon className="size-3.5" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-current opacity-60" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'w-0.5 min-h-[36px] flex-1',
                      lineActive ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </div>
              <p
                className={cn(
                  'pb-5 text-sm leading-tight',
                  completed ? 'font-semibold text-foreground' : 'text-muted-foreground'
                )}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
