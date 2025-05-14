import type { Icon as LucideIcon } from "lucide-svelte";
import {
	ArrowRight,
	ChevronsUpDown,
	CircleDollarSign,
	Github,
	Home,
	Instagram,
	LayoutDashboard,
	Link,
	Linkedin,
	Loader2,
	Menu,
	ScrollText,
	Settings,
	Share,
	TriangleAlert,
	Twitter,
	UserPlus,
	Users2,
	X,
	Send,
	Loader,
	Moon,
	Sun,
	Star,
	Search,
	Clock,
	Calendar,
	Book,
	Briefcase,
	Camera,
	Edit,
	Heart,
	LogIn,
	LogOut,
	MapPin,
	MessageSquare,
	Plane,
	Plus,
	Trash,
	User,
	Users,
	ArrowLeft,
	GraduationCap,
	DollarSign,
	ExternalLink,
	Check,
	Eye,
	ArrowDown,
	ArrowUp,
	Lock
} from 'lucide-svelte';
import Google from './google.svelte';



export type Icon = LucideIcon;

export const Icons = {
	// Navigation & UI
	home: Home,
	menu: Menu,
	check: Check,
	eye: Eye,
	dollarSign: DollarSign,
	externalLink: ExternalLink,
	graduationCap: GraduationCap,
	x: X,
	arrowLeft: ArrowLeft,
	arrowRight: ArrowRight,
	plus: Plus,
	edit: Edit,
	trash: Trash,
	star: Star,
	calendar: Calendar,

	// Authentication
	logIn: LogIn,
	logOut: LogOut,
	user: User,
	userPlus: UserPlus,
	spinner: Loader2,
	google: Google,

	// Activity Categories
	briefcase: Briefcase,
	book: Book,
	plane: Plane,
	heart: Heart,
	mapPin: MapPin,

	// Social
	twitter: Twitter,
	camera: Camera,
	linkedin: Linkedin,
	chat: MessageSquare,

	// Misc
	sun: Sun,
	moon: Moon,
	loader: Loader,
	users: Users2,

	link: Link,
	close: X,
	select: ChevronsUpDown,
	dashboard: LayoutDashboard,
	documents: ScrollText,
	dollarCircle: CircleDollarSign,
	settings: Settings,
	github: Github,
	triangleAlert: TriangleAlert,
	share: Share,
	send: Send,
	advice: TriangleAlert,
	activity: Loader2,
	search: Search,
	clock: Clock,

	arrowDown: ArrowDown,
	arrowUp: ArrowUp,
	lock: Lock,
};

export type IconType = any;
