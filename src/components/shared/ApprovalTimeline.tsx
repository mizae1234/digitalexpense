import { CheckCircle2, Circle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineStep {
    role: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    date?: string;
    approverName?: string;
}

interface ApprovalTimelineProps {
    steps: TimelineStep[];
}

export function ApprovalTimeline({ steps }: ApprovalTimelineProps) {
    return (
        <div className="relative space-y-8 pl-4 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-slate-200">
            {steps.map((step, index) => {
                let Icon = Circle;
                let colorClass = "text-slate-300 bg-white border-slate-200";

                if (step.status === 'APPROVED') {
                    Icon = CheckCircle2;
                    colorClass = "text-emerald-500 bg-white border-emerald-500";
                } else if (step.status === 'REJECTED') {
                    Icon = XCircle;
                    colorClass = "text-red-500 bg-white border-red-500";
                } else if (step.status === 'PENDING') {
                    Icon = Clock;
                    colorClass = "text-amber-500 bg-white border-amber-500";
                }

                return (
                    <div key={index} className="relative flex items-start gap-4">
                        <div className={cn("relative z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white", colorClass.split(' ')[2])}>
                            <Icon className={cn("h-5 w-5", colorClass.split(' ')[0])} />
                        </div>
                        <div className="pt-1">
                            <p className="font-medium text-slate-900">{step.role}</p>
                            {step.status !== 'PENDING' ? (
                                <div className="text-sm text-slate-500">
                                    <span className={cn(
                                        "font-medium",
                                        step.status === 'APPROVED' ? "text-emerald-600" : "text-red-600"
                                    )}>
                                        {step.status}
                                    </span>
                                    {' '}by {step.approverName} • {step.date}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400">Pending</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
