import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminPanel from "./components/Admin/AdminPanel";
import AdminRoute from "./components/Admin/AdminRoute";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import MainPage from "./components/Pages/MainPage";
import SubPage from "./components/Pages/SubPage";
import { getPageData, allPages } from "./data/pageData";
import type { PageData } from "./data/pageData";
import { useGSAP } from "./hooks/useGSAP";
import "./styles/admin.css";

// Background component
const Background: React.FC = () => (
	<div
		id="background-fixed"
		style={{
			position: "fixed",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			backgroundImage:
				'url("/assets/main/images/bgKamien.webp"), url("/assets/main/images/bgKamien.jpg")',
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
			zIndex: -1,
		}}
	/>
);

// Page wrapper component that handles GSAP animations
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const location = useLocation();
	const gsap = useGSAP();

	useEffect(() => {
		if (!gsap) return;

		// Page transition animations and GSAP setup
		const initializeGSAPAnimations = () => {
			gsap.set(".nav-menu li", { opacity: 0, y: -20 });
			gsap.set(".social-icons a", { opacity: 0, y: -20, rotation: -180 });
			gsap.set(".photo-frame", { opacity: 0, scale: 0.8, rotation: 0 });
			gsap.set(".contact-item", { opacity: 0, x: -50 });
			gsap.set(".offer-card", { opacity: 0, y: 100, rotateX: -30 });
			gsap.set(".stat-card", { opacity: 0, y: -30 });
			gsap.set(".welcome-header h2", { opacity: 0, y: 50 });
			gsap.set(".welcome-header p", { opacity: 0, y: 30 });

			// Przygotowanie liczników – zgodnie z początkowym skryptem
			document
				.querySelectorAll<HTMLElement>(".stat-number")
				.forEach((el) => {
					const finalAttr = el.getAttribute("data-final-value");
					const finalText = finalAttr ?? el.textContent ?? "";
					el.setAttribute("data-final-value", finalText);

					if (finalText.trim() === "∞") {
						el.textContent = "∞";
						return;
					}
					if (/\+$/.test(finalText)) {
						el.textContent = "0+";
						return;
					}
					if (/lat$/.test(finalText)) {
						el.textContent = "0 lat";
						return;
					}
					if (/\d/.test(finalText)) {
						el.textContent = "0";
					}
				});

			// Header entrance animation
			const headerTimeline = gsap.timeline();
			headerTimeline
				.to(".nav-menu li", {
					opacity: 1,
					y: 0,
					duration: 0.6,
					stagger: 0.1,
					ease: "back.out(1.7)",
				})
				.to(
					".social-icons a",
					{
						opacity: 1,
						y: 0,
						rotation: 0,
						duration: 0.6,
						stagger: 0.15,
						ease: "back.out(1.7)",
					},
					"-=0.4"
				);

			// Photo frames animation
			const isMobile = window.innerWidth <= 768;
			const framesTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: ".photo-gallery",
					start: "top center+=100",
					toggleActions: "play none none reverse",
				},
			});

			if (isMobile) {
				framesTimeline
					.to(".photo-frame:nth-child(1)", {
						opacity: 1,
						scale: 1,
						rotation: -5,
						duration: 0.8,
						ease: "power2.out",
					})
					.to(
						".photo-frame:nth-child(2)",
						{
							opacity: 1,
							scale: 1,
							rotation: 4,
							duration: 0.8,
							ease: "power2.out",
						},
						"-=0.65"
					)
					.to(
						".photo-frame:nth-child(3)",
						{
							opacity: 1,
							scale: 1,
							rotation: -6,
							duration: 0.8,
							ease: "power2.out",
						},
						"-=0.65"
					)
					.to(
						".photo-frame:nth-child(4)",
						{
							opacity: 1,
							scale: 1,
							rotation: 5,
							duration: 0.8,
							ease: "power2.out",
						},
						"-=0.65"
					);
			} else {
				framesTimeline.to(".photo-frame", {
					opacity: 1,
					scale: 1,
					duration: 0.8,
					stagger: 0.15,
					ease: "power2.out",
				});
			}

			// Welcome section animation
			gsap.timeline({
				scrollTrigger: {
					trigger: ".welcome-section",
					start: "top center+=200",
					toggleActions: "play none none reverse",
				},
			})
				.to(".welcome-header h2", {
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
				})
				.to(
					".welcome-header p",
					{
						opacity: 1,
						y: 0,
						duration: 0.6,
						ease: "power2.out",
					},
					"-=0.4"
				);

			// Offer cards animation
			if (gsap.ScrollTrigger) {
				gsap.ScrollTrigger.batch(".offer-card", {
					onEnter: (elements: any) => {
						gsap.to(elements, {
							opacity: 1,
							y: 0,
							rotateX: 0,
							duration: 1,
							stagger: 0.2,
							ease: "back.out(1.4)",
							transformOrigin: "center bottom",
						});
					},
					start: "top bottom-=100",
				});
			}

			// Sekcja statystyk + animacja liczników
			gsap.timeline({
				scrollTrigger: {
					trigger: ".stats-section",
					start: "top center+=100",
					toggleActions: "play none none reverse",
				},
			})
				.to(".stat-card", {
					opacity: 1,
					scale: 1,
					rotation: 0,
					duration: 1.2,
					stagger: 0.1,
					ease: "power2.out",
				})
				.add(() => {
					document
						.querySelectorAll<HTMLDivElement>(".stat-number")
						.forEach((el) => {
							if (el.getAttribute("data-animated") === "true")
								return;
							const finalText =
								el.getAttribute("data-final-value") || "";
							if (finalText.trim() === "∞") return;

							const hasPlus = /\+$/.test(finalText);
							const hasLat = /lat$/.test(finalText);
							const num =
								parseInt(finalText.replace(/[^\d]/g, ""), 10) ||
								0;
							const suffix = hasLat ? " lat" : hasPlus ? "+" : "";

							const obj = { val: 0 };
							gsap.to(obj, {
								val: num,
								duration: 2,
								ease: "power2.out",
								onUpdate: () => {
									el.textContent =
										Math.round(obj.val).toString() + suffix;
								},
								onComplete: () => {
									el.textContent = num.toString() + suffix;
									el.setAttribute("data-animated", "true");
								},
							});
						});
				});

			// Footer animation
			gsap.timeline({
				scrollTrigger: {
					trigger: "#contact",
					start: "top center+=200",
					toggleActions: "play none none reverse",
				},
			}).to(".contact-item", {
				opacity: 1,
				x: 0,
				duration: 0.8,
				stagger: 0.2,
				ease: "back.out(1.4)",
			});
		};

		const timer = setTimeout(initializeGSAPAnimations, 50);
		return () => clearTimeout(timer);
	}, [location.pathname, gsap]);

	return <>{children}</>;
};

// Wrapper component for subpage layout
const SubPageLayout: React.FC<{ data: PageData }> = ({ data }) => (
	<>
		<Header data={data.navigation} />
		<SubPage data={data} />
		<Footer data={data.footer} />
	</>
);

// Main App component
const App: React.FC = () => {
	const [isAdminAuthenticated, setIsAdminAuthenticated] =
		React.useState(false);

	React.useEffect(() => {
		const authStatus = localStorage.getItem("adminAuthenticated");
		setIsAdminAuthenticated(authStatus === "true");
	}, []);

	const handleAdminLogin = (isAuthenticated: boolean) => {
		setIsAdminAuthenticated(isAuthenticated);
	};

	const handleAdminLogout = () => {
		setIsAdminAuthenticated(false);
	};

	return (
		<Router>
			<div className="min-h-screen">
				<Routes>
					{/* Admin Routes */}
					<Route
						path="/admin/login"
						element={<AdminLogin onLogin={handleAdminLogin} />}
					/>
					<Route
						path="/admin/panel"
						element={
							<AdminRoute>
								<AdminPanel onLogout={handleAdminLogout} />
							</AdminRoute>
						}
					/>

					{/* Public Routes */}
					<Route
						path="/*"
						element={
							<>
								<Background />
								<PageWrapper>
									<Routes>
										<Route
											path="/"
											element={
												<>
													<Header
														data={
															getPageData("/")
																?.navigation
														}
													/>
													<MainPage
														data={getPageData("/")}
													/>
													<Footer
														data={
															getPageData("/")
																?.footer
														}
													/>
												</>
											}
										/>
										{/* Dynamic routes for subpages */}
										{allPages
											.filter((page) => page.slug !== "/")
											.map((page) => (
												<Route
													key={page.id}
													path={page.slug}
													element={
														<SubPageLayout
															data={page}
														/>
													}
												/>
											))}
									</Routes>
								</PageWrapper>
							</>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
};

export default App;
