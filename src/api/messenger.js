export const loadLeadInfoApi = (leadId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: leadId,
          name: `Lead Id${leadId}`,
          phone: 2225557777
        }
      })
    }, 1500);
  });
};

export const loadTextsApi = (leadId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const texts = Array(20).fill({}).map((_, index) => ({
        id: index + 1,
        date: Date.now() + index,
        body: `Message ${index + 1} for ${leadId}`,
        isReply: Math.random() > 0.5,
        isDelivered: true,
      }));
      resolve({
        data: texts
      })
    }, 1500);
  });
};

export const sendTextApi = (leadId, textToBeSent) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: Math.random() * 1000,
          date: Date.now(),
          body: textToBeSent.body,
          isReply: false,
          isDelivered: true,
        }
      })
    }, 1500);
  });
};