"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import { AnimatedThemeToggler } from "@/components/ui/theme-switch";
import { useSidebar } from "@/components/sub/sidebar";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useLogoutModal } from "../ui/logoutModal";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { onOpen: openLogoutModal, LogoutModal } = useLogoutModal();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser()
      setUser(user);
      setLoading(false);
      if (error) {
        throw Error(error.message);
      }
    }
    getUser();
  }, [supabase, setLoading, setUser]);

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit text-2xl">
              Hey, {user?.user_metadata?.full_name?.split(" ")[0]} 👋
            </p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent
        className="sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="flex gap-2">
          <AnimatedThemeToggler />
        </NavbarItem>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform hover:scale-105 cursor-pointer flex-shrink-0"
              color="secondary"
              name={user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
              size="sm"
              src={user?.user_metadata?.picture}
              showFallback

            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" className="w-80">

            <DropdownItem
              key="create-task"
              startContent={<Icon icon="solar:add-circle-bold-duotone" width={20} />}
              description="Create a new task"
              onPress={() => router.push('/?openDrawer=true')}
            >
              Create Task
            </DropdownItem>

            <DropdownItem
              key="logout"
              color="danger"
              startContent={<Icon icon="solar:logout-2-bold-duotone" width={20} />}
              description="Sign out of your account"
              className="text-danger"
              onPress={() => openLogoutModal()}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <LogoutModal />
    </HeroUINavbar>
  );
};
