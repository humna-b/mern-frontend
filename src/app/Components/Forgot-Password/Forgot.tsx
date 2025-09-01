'use client'

import { useState } from 'react'
import { AuthLayout } from '../AuthLayout/AuthLayout'
import { Input } from '../ui/Input/Input' 
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '../ui/Button/Button' 
import Loader from '../ui/Loader/Loader';
export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<any>('') 
  const [confirmpassword , setConfirmpassword] = useState<string>('');
  const [loading,setLoading] = useState<boolean>(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
    setLoading(true);
  
    const data = { 
      email: email, 
      password: password,
    }; 
    try { 
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });  
  
      const responseData = await res.json();
      console.log(responseData); 
      toast(responseData.message);
    } catch (error) {
      console.error('Error during sign-up:', error);
    } 
    finally{ 
      setLoading(false);
    }
  };
  

  return (
    <AuthLayout  
      title="Forgot Password?"
      subtitle="Update Your Password Here"
      alternativeAction="Sign in here"
      alternativeActionLink="/login"
    >   
    <ToastContainer/>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-2"> 
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            required
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /> 
          <Input
            id="confirmpassword"
            name="confirmpassword"
            type="password"
            required
            label="Password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
        </div>

        <Button disabled={loading} type="submit"> {loading ? <Loader/> : 'Update Password'} </Button>
      </form>
    </AuthLayout>
  )
}

