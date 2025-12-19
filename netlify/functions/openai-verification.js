export const handler = async (event, context) => {
  const token = process.env.OPENAI_VERIFICATION_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      body: 'Verification token not configured',
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
    body: token,
  };
};
