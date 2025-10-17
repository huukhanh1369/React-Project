import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Card, Alert, Checkbox } from "antd";
// import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { authService } from "../../services/auth/auth.service.ts";
import type { LoginCredentials } from "../../types/user.types.ts";
import "../../app.css";

interface LocationState {
  message?: string;
}

const SignIn: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = (location.state as LocationState) || {};

  const onFinish = async (values: LoginCredentials) => {
    const { email, password } = values;
    setErrorMsg("");

    // if (!email) {
    //   setErrorMsg("Email không được để trống");
    //   return;
    // }

    // if (!password) {
    //   setErrorMsg("Mật khẩu không được để trống");
    //   return;
    // }

    setLoading(true);

    try {
      const user = await authService.login({ email, password });

      if (!user) {
        setErrorMsg("Email hoặc mật khẩu không chính xác");
        setLoading(false);
        return;
      }

      authService.setCurrentUser(user);
      setErrorMsg("");
      form.resetFields();
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {(locationState.message || errorMsg) && (
        <div className="floating-alert">
          {locationState.message && (
            <Alert message={locationState.message} type="success" showIcon />
          )}
          {errorMsg && <Alert message={errorMsg} type="error" showIcon />}
        </div>
      )}

      <Card className="auth-card">
        <h1 className="auth-title">Trello</h1>
        <h2 className="auth-subtitle">Please sign in</h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Email không được để trống" }]}
          >
            <Input placeholder="Email address" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống" },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <p className="auth-link">
            Don't have an account, <a href="/signup">click here !</a>
          </p>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <p className="footer">© 2025 - Rikkei Education</p>
      </Card>
    </div>
  );
};

export default SignIn;
