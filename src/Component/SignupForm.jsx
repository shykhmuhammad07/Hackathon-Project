// SignupForm.jsx - Updated with modern purple/pink theme
import { Checkbox, Form } from 'antd';
import { Input, Button } from "antd";

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

const SignupForm = ({data, loading}) => (
  <div className="signup-form-container text-white">
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={data}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="signup-form-ant text-gray-100"
    >
      <h2 className="form-title text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center border-b border-purple-400/20 pb-3">
        CREATE YOUR ACCOUNT
      </h2>
      
      {/* Username Field */}
      <Form.Item
        label={<span className="text-gray-300 font-medium">Username</span>}
        name="username"
        rules={[
          { required: true, message: 'Please choose a username!' },
          { min: 3, message: 'Username must be at least 3 characters!' }
        ]}
        className="form-item-ant mb-6"
      >
        <Input 
          placeholder="Choose a username" 
          className="bg-white/10 border-white/20 text-white h-12 rounded-xl hover:border-purple-400 focus:border-purple-400 placeholder-gray-400 text-lg px-4"
          disabled={loading}
        />
      </Form.Item>

      {/* Email Field */}
      <Form.Item
        label={<span className="text-gray-300 font-medium">Email Address</span>}
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
        className="form-item-ant mb-6"
      >
        <Input 
          placeholder="Enter your email address" 
          className="bg-white/10 border-white/20 text-white h-12 rounded-xl hover:border-purple-400 focus:border-purple-400 placeholder-gray-400 text-lg px-4"
          disabled={loading}
        />
      </Form.Item>

      {/* Password Field */}
      <Form.Item
        label={<span className="text-gray-300 font-medium">Password</span>}
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 6, message: 'Password must be at least 6 characters!' }
        ]}
        className="form-item-ant mb-6"
      >
        <Input.Password 
          placeholder="Create a strong password" 
          className="bg-white/10 border-white/20 text-white h-12 rounded-xl hover:border-purple-400 focus:border-purple-400 placeholder-gray-400 text-lg px-4"
          disabled={loading}
        />
      </Form.Item>

      {/* Confirm Password Field */}
      <Form.Item
        label={<span className="text-gray-300 font-medium">Confirm Password</span>}
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match!'));
            },
          }),
        ]}
        className="form-item-ant mb-6"
      >
        <Input.Password 
          placeholder="Confirm your password" 
          className="bg-white/10 border-white/20 text-white h-12 rounded-xl hover:border-purple-400 focus:border-purple-400 placeholder-gray-400 text-lg px-4"
          disabled={loading}
        />
      </Form.Item>

      {/* Terms and Conditions */}
      <Form.Item 
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions')),
          },
        ]}
        className="form-item-ant mb-8"
      >
        <Checkbox className="text-gray-300 hover:text-purple-400 custom-checkbox text-sm">
          I agree to the <button type="button" className="text-purple-300 hover:text-purple-200 font-medium">Terms of Service</button> and <button type="button" className="text-purple-300 hover:text-purple-200 font-medium">Privacy Policy</button>
        </Checkbox>
      </Form.Item>

      {/* Newsletter Opt-in */}
      <Form.Item 
        name="newsletter" 
        valuePropName="checked"
        className="form-item-ant mb-8"
      >
        <Checkbox className="text-gray-300 hover:text-purple-400 custom-checkbox text-sm">
          Send me product updates, tips, and occasional offers
        </Checkbox>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          className="submit-button-ant w-full h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          loading={loading}
        >
          {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
        </Button>
      </Form.Item>
    </Form>

    {/* Custom Styles for Ant Design Components */}
    <style jsx>{`
      :global(.ant-checkbox-checked .ant-checkbox-inner) {
        background-color: #9333ea;
        border-color: #9333ea;
      }
      
      :global(.ant-checkbox-wrapper:hover .ant-checkbox-inner),
      :global(.ant-checkbox:hover .ant-checkbox-inner) {
        border-color: #9333ea;
      }
      
      :global(.ant-input:hover),
      :global(.ant-input-password:hover) {
        border-color: #c084fc !important;
      }
      
      :global(.ant-input:focus),
      :global(.ant-input-password:focus),
      :global(.ant-input-focused),
      :global(.ant-input-password-focused) {
        border-color: #c084fc !important;
        box-shadow: 0 0 0 2px rgba(192, 132, 252, 0.2) !important;
      }
      
      :global(.ant-btn-primary[disabled]) {
        background: #6b7280 !important;
        border-color: #6b7280 !important;
      }
    `}</style>
  </div>
);

export default SignupForm;