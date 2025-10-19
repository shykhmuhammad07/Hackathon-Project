// SignupForm.jsx - Updated with unified styling
import { Checkbox, Form } from 'antd';
import { Input, Button } from "antd";

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

const SignupForm = ({data}) => (
  <div className="signup-form-container text-white">
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={data}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="signup-form-ant text-slate-100"
    >
      <h2 className="form-title text-2xl font-bold mb-6 text-cyan-400 text-center border-b border-cyan-400/20 pb-3">CREATE PROFILE</h2>
      
      {/* Username Field */}
      <Form.Item
        label={<span className="text-slate-300">Username</span>}
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
        className="form-item-ant mb-5"
      >
        <Input 
          placeholder="Enter your username" 
          className="bg-slate-700 border-slate-600 text-white h-12 rounded-xl hover:border-cyan-400 focus:border-cyan-400"
        />
      </Form.Item>

      {/* Email Field */}
      <Form.Item
        label={<span className="text-slate-300">Email</span>}
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
        className="form-item-ant mb-5"
      >
        <Input 
          placeholder="Enter your email" 
          className="bg-slate-700 border-slate-600 text-white h-12 rounded-xl hover:border-cyan-400 focus:border-cyan-400"
        />
      </Form.Item>

      {/* Password Field */}
      <Form.Item
        label={<span className="text-slate-300">Password</span>}
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
        className="form-item-ant mb-5"
      >
        <Input.Password 
          placeholder="Enter your password" 
          className="bg-slate-700 border-slate-600 text-white h-12 rounded-xl hover:border-cyan-400 focus:border-cyan-400"
        />
      </Form.Item>

      {/* Remember Me Checkbox */}
      <Form.Item 
        name="remember" 
        valuePropName="checked" 
        className="form-item-ant mb-6"
      >
        <Checkbox className="text-slate-300 hover:text-cyan-400">Remember me</Checkbox>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          className="submit-button-ant w-full h-12 text-lg font-semibold rounded-xl bg-fuchsia-600 border-none hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50"
        >
          SIGN UP
        </Button>
      </Form.Item>
    </Form>
  </div>
);

export default SignupForm;