export interface Customers {
    id: string;
    name: string;
    phone_number?: string;
    email?: string;
    loyalty_number: string;
    created_at: string;
    membership_type: "standard" | "silver" | "gold" | "platinum";
    loyalty_points_balance: number;
    total_purchases: number;
    last_purchase_date: string;
    status: "active" | "inactive"
    created_by: string;
    created_by_name: string;
    created_by_role: string;


}