import React, { useState } from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Footer from '@/components/layout/Footer';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, MapPin, CreditCard, Settings, LogOut } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number.").optional().or(z.literal('')),
});
type ProfileFormData = z.infer<typeof profileFormSchema>;

const addressFormSchema = z.object({
    id: z.string().optional(),
    label: z.string().min(2, "Label is too short (e.g., Home, Work)"),
    street: z.string().min(5, "Street address is too short"),
    city: z.string().min(2, "City name is too short"),
    state: z.string().min(2, "State is required"),
    zip: z.string().regex(/^\d{5}$/, "Invalid ZIP code"),
    isDefault: z.boolean().optional(),
});
type AddressFormData = z.infer<typeof addressFormSchema>;

// Placeholder data
const sampleUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+11234567890',
  avatarUrl: 'https://via.placeholder.com/150/007BFF/FFFFFF?Text=JD',
};

const sampleAddresses: AddressFormData[] = [
  { id: 'addr1', label: 'Home', street: '123 Main St', city: 'Anytown', state: 'CA', zip: '90210', isDefault: true },
  { id: 'addr2', label: 'Work', street: '456 Business Rd', city: 'Workville', state: 'NY', zip: '10001', isDefault: false },
];

const samplePaymentMethods = [
  { id: 'pm1', type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
  { id: 'pm2', type: 'PayPal', email: 'john.doe@paypal.com', isDefault: false },
];

const ProfilePage = () => {
  console.log('ProfilePage loaded');
  const { toast } = useToast();
  const [user, setUser] = useState(sampleUser);
  const [addresses, setAddresses] = useState<AddressFormData[]>(sampleAddresses);
  const [editingAddress, setEditingAddress] = useState<AddressFormData | null>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user,
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: { label: '', street: '', city: '', state: '', zip: '', isDefault: false }
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log('Profile updated:', data);
    setUser(data);
    toast({ title: "Profile Updated", description: "Your personal information has been saved." });
  };

  const onAddressSubmit = (data: AddressFormData) => {
    console.log('Address saved:', data);
    if(editingAddress && editingAddress.id) {
        setAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? {...data, id: editingAddress.id} : addr));
        toast({ title: "Address Updated", description: `Address "${data.label}" has been updated.` });
    } else {
        const newAddress = {...data, id: `addr${Date.now()}`};
        setAddresses(prev => [...prev, newAddress]);
        toast({ title: "Address Added", description: `Address "${data.label}" has been added.` });
    }
    setEditingAddress(null);
    addressForm.reset({ label: '', street: '', city: '', state: '', zip: '', isDefault: false });
  };

  const handleEditAddress = (address: AddressFormData) => {
    setEditingAddress(address);
    addressForm.reset(address);
  };
  
  const handleDeleteAddress = (addressId?: string) => {
    if (!addressId) return;
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({ title: "Address Deleted", description: "The address has been removed.", variant: "destructive" });
  };


  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/" className="font-bold text-xl">FoodFleet</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/cart-checkout" className="text-sm font-medium">Cart</NavigationMenuLink>
                </NavigationMenuItem>
                 <NavigationMenuItem className="ml-4">
                    <NavigationMenuLink href="/order-page" className="text-sm font-medium">Orders</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Tabs defaultValue="personal-info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="personal-info"><User className="mr-2 h-4 w-4"/>Personal Info</TabsTrigger>
            <TabsTrigger value="addresses"><MapPin className="mr-2 h-4 w-4"/>Addresses</TabsTrigger>
            <TabsTrigger value="payment-methods"><CreditCard className="mr-2 h-4 w-4"/>Payment</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4"/>Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal-info" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Manage your name, email, and phone number.</CardDescription></CardHeader>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField control={profileForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl><Input type="tel" placeholder="+1 123 456 7890" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                      {profileForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Saved Addresses</CardTitle><CardDescription>Manage your delivery addresses.</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {addresses.map(addr => (
                    <Card key={addr.id} className="relative">
                      <CardContent className="pt-6">
                        <p className="font-semibold">{addr.label} {addr.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}</p>
                        <p className="text-sm text-muted-foreground">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                        <div className="absolute top-2 right-2 space-x-1">
                           <Button variant="ghost" size="sm" onClick={() => handleEditAddress(addr)}>Edit</Button>
                           <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(addr.id)} className="text-destructive hover:text-destructive">Delete</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                   {addresses.length === 0 && <p className="text-muted-foreground">No saved addresses yet.</p>}
                </div>
                <Separator className="my-6"/>
                <h3 className="text-lg font-medium mb-3">{editingAddress ? "Edit Address" : "Add New Address"}</h3>
                <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                        <FormField control={addressForm.control} name="label" render={({ field }) => (
                            <FormItem><FormLabel>Label</FormLabel><FormControl><Input placeholder="e.g., Home, Work" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={addressForm.control} name="street" render={({ field }) => (
                            <FormItem><FormLabel>Street</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={addressForm.control} name="city" render={({ field }) => (
                                <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={addressForm.control} name="state" render={({ field }) => (
                                <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="CA" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={addressForm.control} name="zip" render={({ field }) => (
                                <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input placeholder="90210" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={addressForm.control} name="isDefault" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2">
                               <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                               <FormLabel>Set as default address</FormLabel>
                            </FormItem>
                        )} />
                        <div className="flex gap-2">
                            <Button type="submit">{editingAddress ? "Save Changes" : "Add Address"}</Button>
                            {editingAddress && <Button type="button" variant="outline" onClick={() => { setEditingAddress(null); addressForm.reset({ label: '', street: '', city: '', state: '', zip: '', isDefault: false }); }}>Cancel</Button>}
                        </div>
                    </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-methods" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Payment Methods</CardTitle><CardDescription>Manage your saved payment options.</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {samplePaymentMethods.map(pm => (
                        <Card key={pm.id}>
                            <CardContent className="pt-6 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{pm.type} ending in {pm.last4 || pm.email} {pm.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}</p>
                                    {pm.expiry && <p className="text-sm text-muted-foreground">Expires: {pm.expiry}</p>}
                                </div>
                                <Button variant="outline" size="sm">Remove</Button>
                            </CardContent>
                        </Card>
                    ))}
                    {samplePaymentMethods.length === 0 && <p className="text-muted-foreground">No saved payment methods.</p>}
                </div>
                <Button className="mt-6">Add New Payment Method</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Application Settings</CardTitle><CardDescription>Manage your preferences.</CardDescription></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Notification settings, theme preferences, etc. will be here.</p>
                {/* Placeholder for settings options */}
                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        {/* <Switch id="email-notifications" checked /> */}
                        <span>(Switch component needed)</span>
                    </div>
                     <div className="flex items-center justify-between p-3 border rounded-md">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        {/* <Switch id="dark-mode" /> */}
                         <span>(Switch component needed)</span>
                    </div>
                </div>
                <Button variant="destructive" className="mt-8" onClick={() => console.log("Logout user")}>
                    <LogOut className="mr-2 h-4 w-4"/> Log Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;