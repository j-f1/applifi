// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

exports.handler = async () => {
  try {
    return {
      statusCode: 200,
      body:
        "paste the content of https://applifi.netlify.app/.netlify/functions/gen-musickit-key here",
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
