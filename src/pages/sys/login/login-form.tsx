import { supabase } from "@/supabaseClient"; // Keep this import
// import { DB_USER } from "@/_mock/assets_backup"; // ❌ REMOVE: No longer using mock data
import type { SignInReq } from "@/api/services/userService";
import { Icon } from "@/components/icon";
import { GLOBAL_CONFIG } from "@/global-config";
// import { useSignIn } from "@/store/userStore"; // ❓ CHECK: If this is a mock or handles *local* user state, it might still be needed, but the auth logic is now Supabase. We'll adjust it.
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { cn } from "@/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { LoginStateEnum, useLoginStateContext } from "./providers/login-provider";

// 📝 NOTE: Update SignInReq to match what Supabase uses (email instead of username)
// Assuming SignInReq is defined somewhere, you might need to update its definition
// or create a local type for the form:
interface SupabaseSignInReq {
	email: string; // Changed from username
	password: string;
}

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [remember, setRemember] = useState(true);
	const navigatge = useNavigate();
	// ❌ REMOVE: These local states are now managed by react-hook-form
	// const [username, setUsername] = useState("");
	// const [password, setPassword] = useState("");

	const { loginState, setLoginState } = useLoginStateContext();
	// const signIn = useSignIn(); // ❓ Keep/Update this if it manages local application user state after successful auth

	// 📝 Use the updated interface and remove mock defaults
	const form = useForm<SupabaseSignInReq>({
		defaultValues: {
			email: "", // Use empty string instead of mock data
			password: "", // Use empty string instead of mock data
		},
	});

	if (loginState !== LoginStateEnum.LOGIN) return null;

	// 📝 Update the function signature and content to use Supabase
	const handleFinish = async (values: SupabaseSignInReq) => {
		const { email, password } = values;

		// 📝 Removed the redundant check since react-hook-form handles required fields via 'rules'
		// if (!email || !password) {
		//   return Alert.alert("Error", "Please fill in all fields.");
		// }

		setLoading(true);
		try {
			// 1. **Supabase Sign In**
			const {
				data: { user, session },
				error,
			} = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				// 2. **Authentication Error**
				toast.error(t("sys.login.loginFailureTitle"), {
					description: error.message,
					closeButton: true,
				});
				return;
			}

			if (user && session) {
				// 3. **Success**
				// ❓ If you need to manage local state (like calling the original `signIn`), do it here:
				// await signIn(values); // Re-introduce or update if needed for local state management

				navigatge(GLOBAL_CONFIG.defaultRoute, { replace: true });
				toast.success(t("sys.login.loginSuccessTitle"), {
					closeButton: true,
				});
			} else {
				// 4. **Unexpected Issue (e.g., no session/user, but no error)**
				toast.error(t("sys.login.loginFailureTitle"), {
					description: t("sys.login.unexpectedLoginIssue"), // Define a new translation key for this
					closeButton: true,
				});
			}

			// ❌ REMOVE: The messy, broken logic from the user's provided code block
			/*
			if (!username || !password) {
				return Alert.alert("Error", "Please fill in all fields.");
			}

			setLoading(true);
			try {
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				// ... rest of the old, messy logic ...
			} catch (e) {
				// ... rest of the old, messy logic ...
			}
			*/
		} catch (e) {
			console.error("Supabase Sign-in error:", e);
			toast.error(t("sys.login.loginFailureTitle"), {
				description: t("sys.login.somethingWentWrong"), // Define a new translation key for this
				closeButton: true,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)}>
			<Form {...form} {...props}>
				<form onSubmit={form.handleSubmit(handleFinish)} className="space-y-4">
					<div className="flex flex-col items-center gap-2 text-center">
						<h1 className="text-2xl font-bold">
							{t("sys.login.signInFormTitle")}
						</h1>
						<p className="text-balance text-sm text-muted-foreground">
							{t("sys.login.signInFormDescription")}
						</p>
					</div>

					{/* 📝 Field updated to 'email' for Supabase */}
					<FormField
						control={form.control}
						name="email" // Changed from 'username'
						rules={{ required: t("sys.login.accountPlaceholder") }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("sys.login.email")}</FormLabel>{" "}
								{/* Changed label to Email */}
								<FormControl>
									{/* Placeholder updated to reflect the change */}
									<Input placeholder="user@example.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						rules={{ required: t("sys.login.passwordPlaceholder") }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("sys.login.password")}</FormLabel>
								<FormControl>
									{/* Placeholder updated */}
									<Input
										type="password"
										placeholder="Password"
										{...field}
										suppressHydrationWarning
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* 记住我/忘记密码 */}
					<div className="flex flex-row justify-between">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="remember"
								checked={remember}
								onCheckedChange={(checked) =>
									setRemember(checked === "indeterminate" ? false : checked)
								}
							/>
							<label
								htmlFor="remember"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								{t("sys.login.rememberMe")}
							</label>
						</div>
						{/* ... rest of the component (e.g., forgot password, other login methods) ... */}
					</div>

					{/* 登录按钮 */}
					<Button type="submit" className="w-full">
						{loading && <Loader2 className="animate-spin mr-2" />}
						{t("sys.login.loginButton")}
					</Button>
				</form>
			</Form>
		</div>
	);
}

export default LoginForm;