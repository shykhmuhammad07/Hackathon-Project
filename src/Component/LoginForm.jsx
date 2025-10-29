// LoginForm.jsx - Updated with modern purple/pink theme
import { Button, Checkbox, Form, Input } from 'antd';

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

const LoginForm = ({data, loading}) => (
  <div className="login-form-container text-white">
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={data}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="login-form-ant text-gray-100"
    >
      <h2 className="form-title text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center border-b border-purple-400/20 pb-3">
        ACCESS YOUR ACCOUNT
      </h2>
      
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
        rules={[{ required: true, message: 'Please input your password!' }]}
        className="form-item-ant mb-6"
      >
        <Input.Password 
          placeholder="Enter your password" 
          className="bg-white/10 border-white/20 text-white h-12 rounded-xl hover:border-purple-400 focus:border-purple-400 placeholder-gray-400 text-lg px-4"
          disabled={loading}
        />
      </Form.Item>

      {/* Remember Me & Forgot Password */}
      <Form.Item className="mb-8">
        <div className="flex justify-between items-center">
          <Form.Item 
            name="remember" 
            valuePropName="checked" 
            noStyle
          >
            <Checkbox className="text-gray-300 hover:text-purple-400 custom-checkbox">
              Remember me
            </Checkbox>
          </Form.Item>
          
          <button 
            type="button"
            className="text-purple-300 hover:text-purple-200 font-medium transition-colors text-sm"
          >
            Forgot password?
          </button>
        </div>
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
          {loading ? "SIGNING IN..." : "SIGN IN"}
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

export default LoginForm;