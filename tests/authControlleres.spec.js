const auth = require('../controllers/authController');
const { User } = require('../models');

jest.mock('../models');

const mockRequest = (body = {}) => {
  return { body };
};
const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('register function', () => {
  test('should 400 if length of first_name less than 2 or exceed 50 characters', async () => {
    const req = mockRequest({
      first_name: 'a',
    });

    const res = mockResponse();
    await auth.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      result: 'failed',
      message: 'Your first name minlength 2 and cannot exceed 50 characters',
    });
  });

  test('should 409 if email is already registered', async () => {
    const req = mockRequest({
      first_name: 'binar',
      email: 'binarchp111@gmail.com',
      username: 'binaria',
    });

    const res = mockResponse();
    User.findOne.mockResolvedValueOnce({
      email: 'binarchp10@gmail.com',
    });

    await auth.register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      result: 'failed',
      message: 'The email is already registered',
    });
  });

  test('should 400 if email format address is invalid', async () => {
    const req = mockRequest({
      first_name: 'binar',
      email: 'binarchp10',
      username: 'binarian1',
    });

    const res = mockResponse();
    await auth.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      result: 'failed',
      message: 'Please enter valid email address',
    });
  });

  test('should 400 if has uppercase letter in email format', async () => {
    const req = mockRequest({
      first_name: 'binar',
      email: 'Binarchp15@gmail.com',
      username: 'binarian2',
    });

    const res = mockResponse();
    await auth.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      result: 'failed',
      message: 'only lowercase letters allowed for email',
    });
  });

  test('should 409 if username is already registered', async () => {
    const req = mockRequest({
      first_name: 'binar',
      email: 'binar200@gmail.com',
      username: 'binarian',
    });

    const res = mockResponse();
    User.findOne.mockReturnValueOnce();
    User.findOne.mockReturnValueOnce({
      username: 'binarian',
    });

    await auth.register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      result: 'failed',
      message: 'The username is already registered',
    });
  });

  test('should 400 if length of username less than 2 or exceed 50 characters', async () => {
    const req = mockRequest({
      first_name: 'binar',
      email: 'binarchp39@gmail.com',
      username: 'a',
    });

    const res = mockResponse();
    await auth.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      result: 'failed',
      message: 'Your username minlength 2 & cannot exceed 20 characters',
    });
  });

  test('should 400 if password length less than 6 characters', async () => {
    const req = mockRequest({
      first_name: 'binar',
      email: 'binarchp39@gmail.com',
      username: 'binarian20',
      password: 1,
    });

    const res = mockResponse();
    await auth.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      result: 'failed',
      message: 'Your password must be longer than 6 characters',
    });
  });

  test('should 201 if success create user account', async () => {
    const req = mockRequest({
      first_name: 'binar',
      last_name: 'academy',
      email: 'binar103@gmail.com',
      username: 'binar103',
      password: 123456,
    });

    User.create.mockResolvedValueOnce({
      first_name: 'binar',
      last_name: 'academy',
      email: 'binar103@gmail.com',
      username: 'binar103',
    });

    const res = mockResponse();
    await auth.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      result: 'success',
      message: 'Congratulations, your account has been successfully created.',
      data: {
        first_name: 'binar',
        last_name: 'academy',
        email: 'binar103@gmail.com',
        username: 'binar103',
      },
    });
  });
});
