import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Card, Alert, Checkbox } from "antd";
import { authService } from "../../services/auth/auth.service";
import { setAuthData } from "../../stores/slices/authSlice";
import type { LoginCredentials } from "../../types/user.types";
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
  const dispatch = useDispatch();

  const locationState = (location.state as LocationState) || {};

  const onFinish = async (values: LoginCredentials) => {
    const { email, password } = values;
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    setLoading(true);

    try {
      // ✅ Gọi login API
      const result = await authService.login({ email, password });

      if (!result) {
        setErrorMsg("Email hoặc mật khẩu không chính xác");
        setLoading(false);
        return;
      }

      const { user, token } = result;

      // ✅ Lưu token và user vào localStorage
      authService.setAuthData(user, token);

      // ✅ Lưu Redux state
      dispatch(setAuthData({ user, token }));

      // ✅ Reset form và điều hướng
      form.resetFields();
      setErrorMsg("");
      navigate("/dashboard");
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

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
          <Form.Item name="email" rules={[{ required: true, message: "Email không được để trống" }]}>
            <Input className="!w-[296px] !h-[56px] text-base" placeholder="Email address" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Mật khẩu không được để trống" }]}>
            <Input.Password className="!w-[296px] !h-[56px] text-base" placeholder="Password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" initialValue={false}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <p className="auth-link">
            Don't have an account? <a href="/signup">Click here!</a>
          </p>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ width: "298px" }}>
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
