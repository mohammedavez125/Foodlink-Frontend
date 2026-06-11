import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
    HeartHandshake,
    Truck,
    MapPinned,
    Utensils,
    ArrowRight,
    Users,
    CheckCircle2
} from "lucide-react";

function Home() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-32">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
                    </div>

                    <div className="container relative z-10 mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 mb-6 border border-green-100 shadow-sm">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Community Verified & Trusted</span>
                                </div>

                                <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] text-slate-900 tracking-tight">
                                    Transform <span className="text-green-600 relative inline-block">
                                        Surplus Food
                                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 9C118.957 4.47226 238.497 2.49736 355 4" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                    <br />
                                    Into Hope
                                </h1>

                                <p className="mt-8 text-slate-600 text-xl leading-relaxed max-w-xl">
                                    Connecting food donors, NGOs, and volunteers to
                                    minimize waste and fight hunger through a smart, 
                                    transparent redistribution network.
                                </p>

                                <div className="flex flex-wrap gap-4 mt-10">
                                    <Link to="/signup">
                                        <Button size="lg" className="h-14 px-8 bg-green-600 hover:bg-green-700 text-lg shadow-lg hover:shadow-xl transition-all">
                                            Start Donating
                                            <HeartHandshake className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>

                                    <Link to="/signup">
                                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-2 border-slate-200 hover:border-green-600 hover:text-green-600 transition-all">
                                            Join as NGO
                                        </Button>
                                    </Link>
                                </div>

                                <div className="mt-12 flex items-center gap-4 text-slate-500">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm font-medium">Join <span className="text-slate-900 font-bold">2,000+</span> active contributors</p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-green-500 to-blue-500 rounded-[2.5rem] blur-2xl opacity-10 animate-pulse" />
                                <Card className="relative overflow-hidden rounded-[2rem] shadow-2xl border-none">
                                    <img
                                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                                        alt="Food Donation"
                                        className="h-[550px] w-full object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-green-100 p-3 rounded-xl text-green-600">
                                                    <Truck className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">Recent Delivery</p>
                                                    <p className="text-xs text-slate-500 font-medium">150 meals delivered to Central Shelter</p>
                                                </div>
                                                <div className="ml-auto">
                                                    <span className="text-xs font-bold text-green-600">Just Now</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-slate-50" id="how-it-works">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-3xl mx-auto mb-16">
                            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Our Mission</h2>
                            <h3 className="text-4xl font-bold text-slate-900 mb-6">A Systematic Approach to Global Hunger</h3>
                            <p className="text-slate-600 text-lg">We've built a robust platform that streamlines the process from donor pickup to distribution, ensuring efficiency and transparency.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="group hover:shadow-2xl transition-all duration-300 border-none bg-white rounded-3xl overflow-hidden">
                                <CardContent className="p-10 text-center">
                                    <div className="w-16 h-16 mx-auto bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                        <Utensils className="h-8 w-8" />
                                    </div>
                                    <h4 className="font-bold text-2xl text-slate-900 mb-4">List Surplus Food</h4>
                                    <p className="text-slate-500 leading-relaxed">
                                        Donors easily log excess food with detailed info including quantity, type, and expiry.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="group hover:shadow-2xl transition-all duration-300 border-none bg-white rounded-3xl overflow-hidden">
                                <CardContent className="p-10 text-center">
                                    <div className="w-16 h-16 mx-auto bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                        <MapPinned className="h-8 w-8" />
                                    </div>
                                    <h4 className="font-bold text-2xl text-slate-900 mb-4">Smart Matching</h4>
                                    <p className="text-slate-500 leading-relaxed">
                                        Our AI-powered engine matches donations with the most relevant local NGOs in real-time.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="group hover:shadow-2xl transition-all duration-300 border-none bg-white rounded-3xl overflow-hidden">
                                <CardContent className="p-10 text-center">
                                    <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                        <Truck className="h-8 w-8" />
                                    </div>
                                    <h4 className="font-bold text-2xl text-slate-900 mb-4">Real-time Logistics</h4>
                                    <p className="text-slate-500 leading-relaxed">
                                        Track every delivery stage from pickup to the final handover to the community members.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Impact Stats */}
                <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-green-600/10 skew-x-12 transform translate-x-20" />
                    
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 text-center">
                            <div>
                                <h5 className="text-green-500 text-5xl font-extrabold mb-2">1.25M+</h5>
                                <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Meals Saved</p>
                            </div>
                            <div>
                                <h5 className="text-green-500 text-5xl font-extrabold mb-2">450+</h5>
                                <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Partner NGOs</p>
                            </div>
                            <div>
                                <h5 className="text-green-500 text-5xl font-extrabold mb-2">8,200+</h5>
                                <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Active Volunteers</p>
                            </div>
                            <div>
                                <h5 className="text-green-500 text-5xl font-extrabold mb-2">98%</h5>
                                <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Matching Rate</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <Users className="h-16 w-16 mx-auto mb-8 opacity-50" />
                                <h2 className="text-4xl lg:text-6xl font-extrabold mb-8 tracking-tight">
                                    Ready to make a real impact?
                                </h2>
                                <p className="text-green-100 text-xl mb-12 opacity-90">
                                    Whether you're a restaurant with surplus or an NGO in need, 
                                    FoodLink provides the tools to close the gap between waste and hunger.
                                </p>
                                <div className="flex flex-wrap justify-center gap-6">
                                    <Link to="/signup">
                                        <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 px-10 h-16 text-lg font-bold rounded-2xl shadow-xl transition-all">
                                            Join the Movement
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t border-slate-100 py-12">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="bg-green-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">F</div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">FoodLink</span>
                    </div>
                    <p className="text-slate-400 text-sm">© 2026 FoodLink Initiative. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
