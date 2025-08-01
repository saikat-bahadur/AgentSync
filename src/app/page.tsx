"use client";

import { authClient } from "@/lib/auth.client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: session, } = authClient.useSession()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const onSubmit = ()=> {
    authClient.signUp.email({
      email,name,password
    },{
      onError:() => {
        window.alert("Error creating user");
      },
      onSuccess: () => {
        window.alert("User created successfully");
      }
    })
  };

    const onLogin = ()=> {
    authClient.signIn.email({
      email,password
    },{
      onError:() => {
        window.alert("Error creating user");
      },
      onSuccess: () => {
        window.alert("User created successfully");
      }
    })
  };




  if (session) {
    return <div className="flex flex-col p-4 gap-y-4">
      <p>logges in a {session.user.name}</p>
      <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      
      </div>;
  }

  return (

    <div>
    <div>
      <Input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onSubmit} className="mt-4">Create User</Button>
    </div>


     <div>
      <Input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onSubmit} className="mt-4">Create User</Button>
    </div>
     </div>
  );
}
