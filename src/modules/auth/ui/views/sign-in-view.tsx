
'use client';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import {Form} from '@/components/ui/form';

const formSchema = z.object({
    email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  
})



export const SignInView = () => {

    const form =useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });



  return (
    <div>
      <h1>Sign In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => console.log(data))}>
          <Input
            type="email"
            placeholder="Email"
            {...form.register('email')}
          />
          <Input
            type="password"
            placeholder="Password"
            {...form.register('password')}
          />
          <Button type="submit">Sign In</Button>
        </form>
      </Form>
    </div>
  );
}