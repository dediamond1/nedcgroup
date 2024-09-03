// export const baseUrl = 'https://artinsgruppen2.herokuapp.com';
//export const baseUrl = 'https://artinsgruppen2-a22da2d8d991.herokuapp.com';
//export const baseUrl = 'https://artinsapi.techdevcyber.se';
export const baseUrl = 'http://172.20.10.5:3004';

export const apiHelper = async ({ endpoint = '/', options }) => {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    const data = await response.json();
    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
};
