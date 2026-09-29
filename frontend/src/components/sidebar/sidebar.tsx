import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Link from "next/link";
import {
  PanelBottom,
  Package,
  Home,
  LayoutDashboard,
  BookAlert,
  Microchip,
  LogOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function Sidebar() {
  return (
    <div className="flex w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Link
              href="#"
              className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-full"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href="/dashboard"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LayoutDashboard className="h-5 w-5 transition-all" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Link
                  href="#"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <BookAlert className="h-5 w-5 transition-all" />
                  <span className="sr-only">Reports</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Reports</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Link
                  href="#"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Microchip className="h-5 w-5 transition-all" />
                  <span className="sr-only">Sensors</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Sensors</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href="#"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LogOut className="h-5 w-5 transition-all" />
                  <span className="sr-only">Sair</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Sair</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-backgroud gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 ">
          <Sheet>
            <SheetTrigger
              render={
                <button className="sm:hidden">
                  <PanelBottom className="h-5 w-5" />
                  <span className="sr-only">Abrir ou fechar menu lateral</span>
                </button>
              }
            />
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-2 p-4 text-lg font-medium">
                <Link
                  href="#"
                  className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center
                  text-primary-foreground md:text-base gap-2 mb-4"
                  prefetch={false}
                >
                  <Home className="h-5 w-5 transition-all" />
                  <span className="sr-only">Home</span>
                </Link>

                <Link
                  href="#"
                  className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  <LayoutDashboard className="h-5 w-5 transition-all" />
                  Dashboard
                </Link>

                <Link
                  href="#"
                  className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  <BookAlert className="h-5 w-5 transition-all" />
                  Reports
                </Link>

                <Link
                  href="#"
                  className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  <Microchip className="h-5 w-5 transition-all" />
                  Sensores
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <h2>Menu</h2>
        </header>
      </div>
    </div>
  );
}
