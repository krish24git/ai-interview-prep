import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";

async function verifyUser(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  return jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    email: string;
  };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const decoded = await verifyUser(req);
    const { id } = await params;

    const interview = await Interview.findOne({
      _id: id,
      userId: decoded.id,
    });

    if (!interview) {
      return NextResponse.json(
        {
          success: false,
          message: "Interview not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const decoded = await verifyUser(req);
    const { id } = await params;
    const body = await req.json();

    const interview = await Interview.findOneAndUpdate(
      {
        _id: id,
        userId: decoded.id,
      },
      body,
      {
        new: true,
      }
    );

    if (!interview) {
      return NextResponse.json(
        {
          success: false,
          message: "Interview not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const decoded = await verifyUser(req);
    const { id } = await params;

    const interview = await Interview.findOneAndDelete({
      _id: id,
      userId: decoded.id,
    });

    if (!interview) {
      return NextResponse.json(
        {
          success: false,
          message: "Interview not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Interview deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
}