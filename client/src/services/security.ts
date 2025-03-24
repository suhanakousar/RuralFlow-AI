interface SecurityFeatures {
  twoFactorAuth: boolean;
  biometricLogin: boolean;
  deviceManagement: {
    trustedDevices: Device[];
    lastLogin: Record<string, Date>;
  };
  activityLog: {
    transactions: Transaction[];
    loginAttempts: LoginAttempt[];
    settingsChanges: SettingChange[];
  };
}