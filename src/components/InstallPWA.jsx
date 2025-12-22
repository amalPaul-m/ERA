import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Check if user has previously dismissed the popup
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed === 'true') {
            return;
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Show the install popup
            setShowPopup(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowPopup(false);
            return;
        }

        // For development/testing: Show popup after 1 second if beforeinstallprompt hasn't fired
        const devTimeout = setTimeout(() => {
            // Double-check dismissal state before showing
            const isDismissed = localStorage.getItem('pwa-install-dismissed');
            if (!deferredPrompt && isDismissed !== 'true') {
                console.log('Development mode: Showing install popup for testing');
                setShowPopup(true);
            }
        }, 1000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            clearTimeout(devTimeout);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            // In development mode or when PWA install isn't available
            alert('PWA installation is only available in production builds with HTTPS. Run "npm run build" and "npm run preview" to test full PWA installation.');
            setShowPopup(false);
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowPopup(false);
    };

    const handleCancel = () => {
        // Store dismissal in localStorage
        localStorage.setItem('pwa-install-dismissed', 'true');
        setShowPopup(false);
    };

    if (!showPopup) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fade-in">
                {/* Close button */}
                <button
                    onClick={handleCancel}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <Download className="text-blue-600" size={32} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    Install ERA Connect
                </h2>

                {/* Description */}
                <p className="text-center text-gray-600 mb-6">
                    Install our app for quick access and a better experience. Works offline and loads faster!
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInstall}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Install
                    </button>
                </div>
            </div>
        </div>
    );
}
