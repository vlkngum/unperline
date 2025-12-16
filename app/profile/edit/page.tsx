"use client";

import { FormEvent, useEffect, useState } from "react";
import { Camera, Upload, User, Lock, Database, Trash2 } from "lucide-react";
import Select from "react-select";

type ProfileData = {
  id: number;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  location?: string | null;
  bio?: string | null;
  pronouns?: string | null;
  favoriteBooks: string[];
};

const PRONOUN_OPTIONS = [
  { value: "he-him", label: "He/Him" },
  { value: "she-her", label: "She/Her" },
  { value: "they-them", label: "They/Them" },
  { value: "other", label: "Diğer" },
  { value: "prefer-not-to-say", label: "Belirtmek İstemiyorum" },
];

const COUNTRY_OPTIONS = [
  { value: "TR", label: "Türkiye" },
  { value: "US", label: "Amerika Birleşik Devletleri" },
  { value: "GB", label: "Birleşik Krallık" },
  { value: "DE", label: "Almanya" },
  { value: "FR", label: "Fransa" },
  { value: "IT", label: "İtalya" },
  { value: "ES", label: "İspanya" },
  { value: "NL", label: "Hollanda" },
  { value: "BE", label: "Belçika" },
  { value: "CH", label: "İsviçre" },
  { value: "AT", label: "Avusturya" },
  { value: "GR", label: "Yunanistan" },
  { value: "JP", label: "Japonya" },
  { value: "KR", label: "Güney Kore" },
  { value: "CN", label: "Çin" },
  { value: "IN", label: "Hindistan" },
  { value: "BR", label: "Brezilya" },
  { value: "AR", label: "Arjantin" },
  { value: "MX", label: "Meksika" },
  { value: "CA", label: "Kanada" },
  { value: "AU", label: "Avustralya" },
  { value: "RU", label: "Rusya" },
  { value: "ZA", label: "Güney Afrika" },
  { value: "EG", label: "Mısır" },
  { value: "other", label: "Diğer" }
];

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderColor: state.isFocused ? "#3b82f6" : "#475569",
    borderRadius: "0.5rem",
    padding: "0.25rem",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#1e293b",
    borderRadius: "0.5rem",
    border: "1px solid #475569",
    marginTop: "0.25rem",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
      ? "#334155"
      : "transparent",
    color: "#ffffff",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#3b82f6",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#ffffff",
  }),
  input: (base: any) => ({
    ...base,
    color: "#ffffff",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#6b7280",
  }),
};

export default function ProfileEditPage() {
  const [profile, setProfile] = useState<ProfileData>({
    id: 1,
    username: "kullanici_adi",
    email: "email@example.com",
    firstName: "Ad",
    lastName: "Soyad",
    fullName: "Ad Soyad",
    avatarUrl: null,
    bannerUrl: null,
    location: "Türkiye",
    bio: "Kısa biyografi yazısı buraya gelecek...",
    pronouns: "o/ona",
    favoriteBooks: ["", "", "", ""]
  });
  
  const [activeTab, setActiveTab] = useState<"info" | "password" | "data" | "delete">("info");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  // Profil verilerini yükle
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile");
      
      if (!res.ok) {
        throw new Error("Profil yüklenemedi");
      }
      
      const data = await res.json();
      setProfile({
        ...data,
        favoriteBooks: data.favoriteBooks?.length ? data.favoriteBooks : ["", "", "", ""]
      });
    } catch (error) {
      console.error("Profil yükleme hatası:", error);
      setProfileError("Profil bilgileri yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleImageSelect = (field: "avatarUrl" | "bannerUrl", file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, [field]: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleFavoriteBookChange = (index: number, value: string) => {
    const next = [...profile.favoriteBooks];
    next[index] = value;
    setProfile({ ...profile, favoriteBooks: next });
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMessage(null);
    setProfileError(null);
    
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: profile.username,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.avatarUrl,
          bannerUrl: profile.bannerUrl,
          location: profile.location,
          bio: profile.bio,
          pronouns: profile.pronouns,
          favoriteBooks: profile.favoriteBooks.filter(b => b.trim())
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Güncelleme başarısız");
      }

      const updated = await res.json();
      setProfile({
        ...updated,
        favoriteBooks: updated.favoriteBooks?.length ? updated.favoriteBooks : ["", "", "", ""]
      });
      
      setProfileMessage("Profil başarıyla güncellendi!");
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (error: any) {
      setProfileError(error.message || "Profil güncellenirken bir hata oluştu");
      setTimeout(() => setProfileError(null), 5000);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Şifreler uyuşmuyor");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Yeni şifre en az 6 karakter olmalıdır");
      return;
    }
    
    setSavingPassword(true);
    setPasswordError(null);
    setPasswordMessage(null);
    
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Şifre güncellenemedi");
      }

      setPasswordMessage("Şifre başarıyla güncellendi!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMessage(null), 3000);
    } catch (error: any) {
      setPasswordError(error.message || "Şifre güncellenirken bir hata oluştu");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }

    if (!confirm("SON UYARI: Tüm verileriniz kalıcı olarak silinecektir. Devam etmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const res = await fetch("/api/profile/delete", {
        method: "DELETE"
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Hesap silinemedi");
      }

      alert("Hesabınız başarıyla silindi. Oturumunuz kapatılacak.");
      window.location.href = "/";
    } catch (error: any) {
      alert(error.message || "Hesap silinirken bir hata oluştu");
    }
  };

  const tabs = [
    { value: "info", label: "Bilgiler", icon: User },
    { value: "password", label: "Şifre", icon: Lock },
    { value: "data", label: "Data", icon: Database },
    { value: "delete", label: "Sil", icon: Trash2 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-2xl bg-neutral-950/40 p-2 md:p-4 min-w-full">
      <div className="w-full px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profil Ayarları</h1>
          <p className="text-gray-400">Hesap bilgilerinizi düzenleyin ve yönetin</p>
        </div>

        <div className="flex flex-col gap-6 w-full">
          {/* Sidebar Tabs */}
          <div className="w-full flex justify-center items-center min-w-full">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-2 flex flex-row gap-2 justify-center items-center">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;
                return (  
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              {/* Info Tab */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* Banner Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Kapak Fotoğrafı
                    </label>
                    <div className="relative h-60 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg overflow-hidden border-2 border-dashed border-slate-600 hover:border-blue-500 transition-colors group">
                      {profile.bannerUrl && (
                        <img src={profile.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                      )}
                      <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-center">
                          <Upload className="mx-auto mb-2" size={24} />
                          <span className="text-sm text-white">Fotoğraf Yükle</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageSelect("bannerUrl", e.target.files?.[0])}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profil Fotoğrafı
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden border-4 border-slate-700 group">
                        {profile.avatarUrl ? (
                          <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                            {profile.firstName?.[0]}{profile.lastName?.[0]}
                          </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera size={20} />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageSelect("avatarUrl", e.target.files?.[0])}
                          />
                        </label>
                      </div>
                      <div className="text-sm text-gray-400">
                        <p>Tavsiye edilen boyut: 400x400px</p>
                        <p>Maksimum dosya boyutu: 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-700"></div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Kullanıcı Adı
                      </label>
                      <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => handleProfileChange("username", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="kullanici_adi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ad
                      </label>
                      <input
                        type="text"
                        value={profile.firstName || ""}
                        onChange={(e) => handleProfileChange("firstName", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Ad"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Soyad
                      </label>
                      <input
                        type="text"
                        value={profile.lastName || ""}
                        onChange={(e) => handleProfileChange("lastName", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Soyad"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ülke
                      </label>
                      <Select
                        value={COUNTRY_OPTIONS.find(opt => opt.value === profile.location)}
                        onChange={(option) => handleProfileChange("location", option?.value || "")}
                        options={COUNTRY_OPTIONS}
                        styles={customSelectStyles}
                        placeholder="Ülke seçin..."
                        isSearchable
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Zamirler
                      </label>
                      <Select
                        value={PRONOUN_OPTIONS.find(opt => opt.value === profile.pronouns)}
                        onChange={(option) => handleProfileChange("pronouns", option?.value || "")}
                        options={PRONOUN_OPTIONS}
                        styles={customSelectStyles}
                        placeholder="Zamir seçin..."
                        isSearchable
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Biyografi
                    </label>
                    <textarea
                      value={profile.bio || ""}
                      onChange={(e) => handleProfileChange("bio", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Kendinizden bahsedin..."
                    />
                  </div>

                  <div className="h-px bg-slate-700"></div>

                  {/* Favorite Books */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Favori Kitaplar (4 adet)
                    </label>
                    <div className="flex flex-row gap-3">
                      {[0, 1, 2, 3].map((i) => (
                        <input
                          key={i}
                          type="text"
                          value={profile.favoriteBooks[i] || ""}
                          onChange={(e) => handleFavoriteBookChange(i, e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={`Favori kitap ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {profileError && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 text-sm">
                      {profileError}
                    </div>
                  )}

                  {/* Success Message */}
                  {profileMessage && (
                    <div className="bg-green-500/10 border border-green-500/50 rounded-lg px-4 py-3 text-green-400 text-sm">
                      {profileMessage}
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
                    >
                      {savingProfile ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </button>
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === "password" && (
                <div className="space-y-4 max-w-md">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Şifre Değiştir</h2>
                    <p className="text-gray-400 text-sm mb-6">
                      Güvenliğiniz için güçlü bir şifre kullanın
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mevcut Şifre
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  {passwordError && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 text-sm">
                      {passwordError}
                    </div>
                  )}

                  {passwordMessage && (
                    <div className="bg-green-500/10 border border-green-500/50 rounded-lg px-4 py-3 text-green-400 text-sm">
                      {passwordMessage}
                    </div>
                  )}

                  <button
                    onClick={handlePasswordSubmit}
                    disabled={savingPassword}
                    className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
                  >
                    {savingPassword ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                  </button>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === "data" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Veri Yönetimi</h2>
                  <p className="text-gray-400 mb-6">
                    Verilerinizi dışa aktarın veya yedekleyin
                  </p>
                  <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-8 text-center">
                    <Database className="mx-auto mb-4 text-gray-500" size={48} />
                    <p className="text-gray-400 mb-4">
                      Bu özellik yakında aktif olacak...
                    </p>
                    <button
                      disabled
                      className="px-6 py-2.5 bg-slate-700 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                    >
                      Verileri Dışa Aktar
                    </button>
                  </div>
                </div>
              )}

              {/* Delete Tab */}
              {activeTab === "delete" && (
                <div className="max-w-md">
                  <h2 className="text-xl font-bold text-white mb-2">Hesabı Sil</h2>
                  <p className="text-gray-400 mb-6">
                    Bu işlem geri alınamaz. Hesabınız kalıcı olarak silinecektir.
                  </p>
                  
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-red-400 mb-3">Uyarı</h3>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li>• Tüm verileriniz kalıcı olarak silinecek</li>
                      <li>• Gönderileriniz ve yorumlarınız kaldırılacak</li>
                      <li>• Takipçileriniz ve takip ettikleriniz silinecek</li>
                      <li>• Bu işlem geri alınamaz</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleDeleteAccount}
                    className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
                  >
                    Hesabı Kalıcı Olarak Sil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}