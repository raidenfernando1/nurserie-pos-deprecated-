import { NextResponse } from "next/server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";

export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const response = await db`
     SELECT 
    c.id,
    c.name,
    c.email,
    c.phone_number,
    c.loyalty_number,
    c.created_by,  
    u.name AS created_by_name,
    u.role AS created_by_role,
    c.created_at
FROM customers c
LEFT JOIN "user" u ON c.created_by = u.id
ORDER BY c.created_at DESC;

    `;
        return NextResponse.json(response);
    }

    catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 });
    }
}

export async function POST(req: NextResponse) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - Please Sign In' },
                { status: 401 }
            )
        };
        const body = await req.json();
        const { name, email, phone_number } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            );
        }
        const result = await db`
        INSERT INTO customers (name, email, phone_number, created_by)
        VALUES (${name}, ${email}, ${phone_number}, ${session.user.id})
        RETURNING id, name, email, phone_number, created_by, created_at`;

        return NextResponse.json(
            {
                message: 'Customer created Successfully',
                data: result[0]
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Database error', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        )
    }
}