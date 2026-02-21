import { useState } from "react";
import { Card, FormInput, FormSelect, PrimaryBtn, ErrorBox, SuccessBox } from "../components/UI";

export default function AuthPage({ onLogin, users, setUsers }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Manager");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleLogin() {
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) { setError("Invalid email or password. Try: admin@fleetflow.com / admin123"); return; }
    onLogin(found);
  }

  function handleSignup() {
    setError("");
    setSuccess("");
    if (!name || !email || !password || !confirmPassword) { setError("Please fill all fields."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (users.find((u) => u.email === email)) { setError("This email is already registered."); return; }
    const newUser = { id: "U" + Date.now(), name, email, password, role };
    setUsers([...users, newUser]);
    setSuccess("Account created! You can now sign in.");
    setMode("login");
    setPassword("");
    setName("");
    setConfirmPassword("");
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-black font-black text-2xl">
              F
            </div>
            <span className="text-4xl font-black text-white tracking-tight">FleetFlow</span>
          </div>
          <p className="text-gray-500 text-sm">Modular Fleet and Logistics Management System</p>
        </div>

        <Card>
          {/* Tab Toggle */}
          <div className="flex mb-6 bg-gray-700 rounded-xl p-1">
            <button
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "login" ? "bg-cyan-500 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "signup" ? "bg-cyan-500 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <ErrorBox message={error} />
          <SuccessBox message={success} />

          {mode === "login" ? (
            <>
              <FormInput label="Email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <FormInput label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <FormSelect label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Manager</option>
                <option>Dispatcher</option>
                <option>Safety Officer</option>
                <option>Financial Analyst</option>
              </FormSelect>
              <div className="text-right mb-4">
                <button className="text-xs text-cyan-400 hover:underline">Forgot Password?</button>
              </div>
              <PrimaryBtn onClick={handleLogin} className="w-full py-3 text-base">Sign In</PrimaryBtn>
              <p className="text-center text-gray-500 text-xs mt-4">
                Demo: admin@fleetflow.com / admin123
              </p>
            </>
          ) : (
            <>
              <FormInput label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
              <FormInput label="Email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <FormSelect label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Manager</option>
                <option>Dispatcher</option>
                <option>Safety Officer</option>
                <option>Financial Analyst</option>
              </FormSelect>
              <FormInput label="Password" type="password" placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
              <FormInput label="Confirm Password" type="password" placeholder="Repeat your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <PrimaryBtn onClick={handleSignup} className="w-full py-3 text-base">Create Account</PrimaryBtn>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}