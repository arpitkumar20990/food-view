import { Link } from "react-router-dom";

const ChooseRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Register
          </h1>
          <p className="mt-2 text-gray-500">
            Pick how you want to join the platform.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <Link
            to="/user/register"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-center transition duration-200"
          >
            Register as Normal User
          </Link>

          <Link
            to="/food-partner/register"
            className="w-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg text-center transition duration-200"
          >
            Register as Food Partner
          </Link>
        </div>

        <div className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/user/login"
            className="text-orange-500 hover:text-orange-600 font-semibold"
          >
            Sign in as User
          </Link>
        </div>

        <div className="mt-2 text-center text-gray-600">
          Already a food partner?{" "}
          <Link
            to="/food-partner/login"
            className="text-orange-500 hover:text-orange-600 font-semibold"
          >
            Sign in as food partner
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ChooseRegister;