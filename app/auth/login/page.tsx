"use client";

export default function LoginPage() {
  return (
    <div className="flex flex-col text-center">
      <span>Sitemiz şu an için beta test aşamasındadır.</span>
      <span>
        Test kullanıcısı olmak için lütfen{" "}
        <Link
          isExternal
          href="https://forms.gle/mdBgZTKm28xU78sh9"
          className="text-pretty text-primary font-bold underline"
        >
          formumuzu
        </Link>{" "}
        doldurun.
      </span>
    </div>
  );
}
