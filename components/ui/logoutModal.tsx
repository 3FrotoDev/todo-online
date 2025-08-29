"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Icon } from '@iconify/react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface LogoutModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onOpen, onClose }: LogoutModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={(open) => !open && onClose()}
      backdrop="blur"
    >
      <ModalContent className="">
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Icon 
                icon="solar:logout-2-bold-duotone" 
                width={24} 
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Logout
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to sign out?
              </p>
            </div>
          </div>
        </ModalHeader>
        
        <ModalBody className="py-4">
          <div className="rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon 
                icon="solar:info-circle-bold-duotone" 
                width={20} 
                className="mt-0.5 flex-shrink-0" 
              />
              <div className="text-sm">
                <p className="font-medium mb-1">You will be signed out of:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your current session</li>
                  <li>• All open tabs and windows</li>
                  <li>• Any unsaved work or progress</li>
                </ul>
              </div>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter className="flex gap-2 pt-2">
          <Button
            variant="light"
            onPress={onClose}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            color="danger"
            variant="solid"
            onPress={() => (handleLogout(), onClose())}
            startContent={<Icon icon="solar:logout-2-bold-duotone" width={18} />}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Yes, Logout
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function useLogoutModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return {
    isOpen,
    onOpen,
    onClose,
    LogoutModal: () => <LogoutModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
  };
}
