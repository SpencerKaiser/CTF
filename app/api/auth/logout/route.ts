export const POST = () => {
  return new Response(undefined, {
    status: 204,
    headers: {
      'Set-Cookie': 'session=; Max-Age=0; Path=/; HttpOnly',
    },
  });
};
