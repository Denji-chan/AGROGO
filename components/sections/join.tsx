"use client";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowUpRight,
  Check,
  Sprout,
  Handshake,
  LoaderCircle,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Title, regionKeys, serviceKeys, type JoinIntent } from "../shared";
type Fields = {
  name: string;
  phone: string;
  region: string;
  service: string;
  consent: boolean;
  website: string;
};
export function Join({ intent }: { intent: JoinIntent }) {
  const t = useTranslations("join"),
    root = useTranslations(),
    locale = useLocale();
  const [role, setRole] = useState("farmer"),
    [done, setDone] = useState(false),
    [serverError, setServerError] = useState("");
  const requestId = useRef<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    defaultValues: {
      name: "",
      phone: "+998 ",
      region: "",
      service: "",
      consent: false,
      website: "",
    },
    mode: "onBlur",
  });
  const regions = root.raw("geography.regions") as string[],
    services = root.raw("services.items") as { title: string }[];
  useEffect(() => {
    setRole(intent.role);
    if (intent.region) setValue("region", intent.region);
    if (intent.service) setValue("service", intent.service);
    if (intent.revision) {
      setDone(false);
    }
  }, [intent, setValue]);
  async function submit(values: Fields) {
    setServerError("");
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          id: requestId.current,
          role,
          locale,
        }),
      });
      if (!response.ok) {
        const result = (await response
          .json()
          .catch(() => ({ error: "server" }))) as { error?: string };
        setServerError(
          t(`errors.${result.error === "invalid" ? "invalid" : "server"}`),
        );
        return;
      }
      setDone(true);
      requestId.current = null;
      reset();
    } catch {
      setServerError(t("errors.server"));
    }
  }
  return (
    <section id="join" className="join-section">
      <div className="container join-layout">
        <div className="join-intro">
          <div className="eyebrow">{t("eyebrow")}</div>
          <Title text={t("title")} />
          <p>{t("description")}</p>
          <div className="join-mark" aria-hidden="true">
            <Sprout strokeWidth={1} />
          </div>
          <span className="join-wordmark" aria-hidden="true">
            AGROGO.
          </span>
        </div>
        <div className="join-form-card">
          {done ? (
            <div className="form-success" role="status">
              <span>
                <Check size={35} />
              </span>
              <h3>{t("successTitle")}</h3>
              <p>{t("successText")}</p>
              <button className="pill-btn green" onClick={() => setDone(false)}>
                {t("again")}
                <ArrowUpRight size={20} />
              </button>
            </div>
          ) : (
            <>
              <Tabs value={role} onValueChange={setRole}>
                <TabsList className="join-tabs">
                  <TabsTrigger value="farmer">
                    <Sprout size={17} />
                    {t("farmer")}
                  </TabsTrigger>
                  <TabsTrigger value="partner">
                    <Handshake size={17} />
                    {t("partner")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <form
                onSubmit={handleSubmit(submit)}
                noValidate
                className="join-form"
              >
                <div className="form-field">
                  <label htmlFor="lead-name">{t("name")}</label>
                  <input
                    id="lead-name"
                    maxLength={100}
                    autoComplete="name"
                    placeholder={t("namePlaceholder")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    {...register("name", {
                      required: t("errors.name"),
                      minLength: { value: 2, message: t("errors.name") },
                      maxLength: 100,
                      validate: (v) => v.trim().length >= 2 || t("errors.name"),
                    })}
                  />
                  {errors.name && (
                    <p id="name-error" className="field-error">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="lead-phone">{t("phone")}</label>
                  <input
                    id="lead-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder={t("phonePlaceholder")}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    {...register("phone", {
                      required: t("errors.phone"),
                      validate: (v) =>
                        /^\+[1-9]\d{8,14}$/.test(v.replace(/[\s()\-]/g, "")) ||
                        t("errors.phone"),
                    })}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="field-error">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label id="region-label" htmlFor="lead-region">
                      {t("region")}
                    </label>
                    <Controller
                      name="region"
                      control={control}
                      rules={{ required: t("errors.region") }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="lead-region"
                            ref={field.ref}
                            onBlur={field.onBlur}
                            className="form-select"
                            aria-labelledby="region-label"
                            aria-invalid={!!errors.region}
                            aria-describedby={
                              errors.region ? "region-error" : undefined
                            }
                          >
                            <SelectValue placeholder={t("regionPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {regionKeys.map((key, i) => (
                              <SelectItem key={key} value={key}>
                                {regions[i]}
                              </SelectItem>
                            ))}
                            <SelectItem value="other">
                              {t("otherRegion")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.region && (
                      <p id="region-error" className="field-error">
                        {errors.region.message}
                      </p>
                    )}
                  </div>
                  <div className="form-field">
                    <label id="service-label" htmlFor="lead-service">
                      {t("service")}
                    </label>
                    <Controller
                      name="service"
                      control={control}
                      rules={{ required: t("errors.service") }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="lead-service"
                            ref={field.ref}
                            onBlur={field.onBlur}
                            className="form-select"
                            aria-labelledby="service-label"
                            aria-invalid={!!errors.service}
                            aria-describedby={
                              errors.service ? "service-error" : undefined
                            }
                          >
                            <SelectValue
                              placeholder={t("servicePlaceholder")}
                            />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {serviceKeys.map((key, i) => (
                              <SelectItem key={key} value={key}>
                                {services[i].title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.service && (
                      <p id="service-error" className="field-error">
                        {errors.service.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="honeypot" aria-hidden="true">
                  <label htmlFor="website" lang="en">
                    Website
                  </label>
                  <input
                    id="website"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                  />
                </div>
                <div className="consent-row">
                  <Controller
                    name="consent"
                    control={control}
                    rules={{ validate: (v) => v || t("errors.consent") }}
                    render={({ field }) => (
                      <Checkbox
                        id="lead-consent"
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(v === true)}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        aria-invalid={!!errors.consent}
                        aria-describedby={
                          errors.consent ? "consent-error" : undefined
                        }
                      />
                    )}
                  />
                  <label htmlFor="lead-consent">{t("consent")}</label>
                </div>
                {errors.consent && (
                  <p id="consent-error" className="field-error">
                    {errors.consent.message}
                  </p>
                )}
                {serverError && (
                  <p className="form-server-error" role="alert">
                    {serverError}
                  </p>
                )}
                <button
                  className="form-submit"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("submitting") : t("submit")}
                  <span>
                    {isSubmitting ? (
                      <LoaderCircle className="spin" size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </span>
                </button>
                <p className="form-note">{t("note")}</p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
