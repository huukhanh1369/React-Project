import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Alert } from "antd";
import type { SignupCredentials } from "../../types/user.types";
import { authService } from "../../services/auth/auth.service";
import "../../App.css";

type FormValues = SignupCredentials;

const Signup: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Validate Email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate Password strength
  const validatePassword = (password: string): boolean => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return (
      password.length >= 8 && hasLower && hasUpper && hasNumber && hasSpecial
    );
  };

  const onFinish = async (values: FormValues) => {
    const { email, username, password, confirmPassword } = values;
    setErrorMsg("");

    if (!validateEmail(email)) {
      setErrorMsg("Email không đúng định dạng");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMsg(
        "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt"
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu không trùng khớp");
      return;
    }

    setLoading(true);

    try {
      // ✅ Kiểm tra email trùng
      const existingUsers = await authService.checkEmailExists(email);
      if (existingUsers.length > 0) {
        setErrorMsg("Email đã được đăng ký");
        setLoading(false);
        return;
      }

      await authService.signup({ email, username, password });
      navigate("/dashboard");

      form.resetFields();
      setErrorMsg("");

      // ✅ Điều hướng sang Dashboard
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Lỗi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h1 className="auth-title">Trello</h1>
        <h2 className="auth-subtitle">Please sign up</h2>

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            style={{ marginBottom: "16px" }}
          />
        )}

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
            <Input
              className="!w-[296px] !h-[56px] text-base"
              placeholder="Email address"
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Username không được để trống" },
            ]}
          >
            <Input
              className="!w-[296px] !h-[56px] text-base"
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống" },
            ]}
          >
            <Input.Password
              className="!w-[296px] !h-[56px] text-base"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Xác nhận mật khẩu không được để trống",
              },
            ]}
          >
            <Input.Password
              className="!w-[296px] !h-[56px] text-base"
              placeholder="Confirm password"
            />
          </Form.Item>

          <p className="auth-link">
            Already have an account? <a href="/">Click here!</a>
          </p>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ width: "298px" }}
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>

        <p className="footer">© 2025 - Rikkei Education</p>
      </Card>
    </div>
  );
};

export default Signup;
