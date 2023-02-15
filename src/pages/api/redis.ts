import { NextResponse } from 'next/server';
import { redis } from '../../server/redis';

export const config = {
    runtime: 'edge',
};

const handler = async () => {
    const result = await redis.get<string>("google");
    return NextResponse.redirect(result || "/", 301);
};

export default handler;