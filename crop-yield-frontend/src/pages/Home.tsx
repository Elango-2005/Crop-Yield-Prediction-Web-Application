import axios from "axios";
import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import AOS from 'aos';
import "aos/dist/aos.css";
import {
  Sprout, Leaf, User, Globe, Wheat, Calendar,
  CloudRain, FlaskConical, Thermometer, Zap, RotateCcw, TrendingUp,
  CheckCircle2, Trophy, Database, Filter, BarChart3, Braces, Cpu,
  Target, Mail, Sparkles, ArrowRight, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip,
} from "recharts";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import heroImage from "@/assets/hero-farming.jpg";

const COUNTRIES = ["India", "United States", "Brazil", "China", "Australia", "France", "Argentina", "Canada", "Germany", "Nigeria"];
const CROPS = ["Wheat", "Rice, paddy", "Maize", "Potatoes", "Soybeans", "Sorghum", "Cassava", "Sweet potatoes", "Yams", "Plantains and others"];

const FEATURE_DATA = [
  { name: "Crop Type", value: 60.9, color: "oklch(0.52 0.14 148)" },
  { name: "Pesticides", value: 11.0, color: "oklch(0.62 0.15 130)" },
  { name: "Avg Temperature", value: 10.9, color: "oklch(0.7 0.14 90)" },
  { name: "Rainfall", value: 8.6, color: "oklch(0.65 0.13 175)" },
  { name: "Area", value: 5.5, color: "oklch(0.6 0.1 65)" },
  { name: "Year", value: 3.1, color: "oklch(0.55 0.08 40)" },
];

const MODELS = [
  { name: "Random Forest", score: 98.57, best: true },
  { name: "Decision Tree", score: 97.49, best: false },
  { name: "XGBoost", score: 96.06, best: false },
  { name: "Gradient Boosting", score: 83.33, best: false },
  { name: "Linear Regression", score: 8.42, best: false },
];

const WORKFLOW = [
  { icon: Database, label: "Dataset", desc: "Historical agri data" },
  { icon: Filter, label: "Data Preprocessing", desc: "Clean & normalize" },
  { icon: BarChart3, label: "EDA", desc: "Explore patterns" },
  { icon: Braces, label: "Feature Encoding", desc: "Transform features" },
  { icon: Cpu, label: "Model Training", desc: "Fit algorithms" },
  { icon: Trophy, label: "Random Forest", desc: "Best model" },
  { icon: Target, label: "Prediction", desc: "Yield forecast" },
];

interface PredictionResult {
  prediction_hg_ha: number;
  prediction_kg_ha: number;
  prediction_tonnes_ha: number;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [form, setForm] = useState({
    Area: "",
    Item: "",
    Year: "",
    average_rain_fall_mm_per_year: "",
    pesticides_tonnes: "",
    avg_temp: "",
  });
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const reset = () => {
    setForm({ Area: "", Item: "", Year: "", average_rain_fall_mm_per_year: "", pesticides_tonnes: "", avg_temp: "" });
    setResult(null);
  };

  const handlePredict = async () => {
    if (
      !form.Area ||
      !form.Item ||
      !form.Year ||
      !form.average_rain_fall_mm_per_year ||
      !form.pesticides_tonnes ||
      !form.avg_temp
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setResult(null);

    const payload = {
      Area: form.Area,
      Item: form.Item,
      Year: Number(form.Year),
      average_rain_fall_mm_per_year: Number(form.average_rain_fall_mm_per_year),
      pesticides_tonnes: Number(form.pesticides_tonnes),
      avg_temp: Number(form.avg_temp),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        payload
      );

      setResult({
        prediction_hg_ha: response.data.predicted_yield,
        prediction_kg_ha: response.data.predicted_yield / 10,
        prediction_tonnes_ha: response.data.predicted_yield / 10000,
      });
    } catch (err) {
      toast.error("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero-bg">
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gradient-primary-bg shadow-[var(--shadow-glow)]">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold sm:text-xl">
                Crop Yield <span className="gradient-text">Prediction</span>
              </h1>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                Predict agricultural crop yield using Machine Learning
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { l: "Home", id: "home" },
              { l: "Predict", id: "predict" },
              { l: "About", id: "about" },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-all hover:bg-primary/10 hover:text-primary"
              >
                {n.l}
              </button>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-all hover:bg-primary/10 hover:text-primary"
            >
              <FaGithub className="h-4 w-4" /> GitHub
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-soft)]">
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" data-aos="fade-up" className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="animate-[fade-in_0.8s_ease-out]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Powered by Random Forest · 98.57% R²
            </div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              AI-Powered <span className="gradient-text">Crop Yield</span> Prediction
            </h2>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Predict crop yield accurately using historical agricultural and environmental
              data with Machine Learning. Built for farmers, agronomists, and researchers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => scrollTo("predict")}
                className="rounded-full gradient-primary-bg text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
              >
                Start Prediction <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("about")}
                className="rounded-full border-primary/30 hover:bg-primary/10"
              >
                Learn More
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { n: "98.57%", l: "R² Score" },
                { n: "10+", l: "Crop Types" },
                { n: "60k+", l: "Data Points" },
              ].map((s) => (
                <div key={s.l} className="glass-card rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold gradient-text">{s.n}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-[fade-in_1s_ease-out]">
            <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl" />
            <img
              src={heroImage}
              alt="Smart farming with AI"
              className="relative w-full rounded-3xl shadow-[var(--shadow-glow)] animate-float"
            />
            <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary-bg">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Predicted yield</div>
                  <div className="text-sm font-bold">3.64 t/ha</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREDICTION FORM */}
      <section id="predict" data-aos="fade-up" className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-bold sm:text-4xl">Make a Prediction</h3>
            <p className="mt-3 text-muted-foreground">
              Enter environmental & agricultural parameters to forecast crop yield
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <Card className="glass-card lg:col-span-3 rounded-3xl border-0 p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField icon={Globe} label="Country / Area">
                  <Select value={form.Area} onValueChange={(v) => setForm({ ...form, Area: v })}>
                    <SelectTrigger className="rounded-xl bg-white/60"><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </FormField>
                <FormField icon={Wheat} label="Crop Type">
                  <Select value={form.Item} onValueChange={(v) => setForm({ ...form, Item: v })}>
                    <SelectTrigger className="rounded-xl bg-white/60"><SelectValue placeholder="Select crop" /></SelectTrigger>
                    <SelectContent>{CROPS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </FormField>
                <FormField icon={Calendar} label="Year">
                  <Input type="number" placeholder="2014" value={form.Year} onChange={(e) => setForm({ ...form, Year: e.target.value })} className="rounded-xl bg-white/60" />
                </FormField>
                <FormField icon={CloudRain} label="Avg Rainfall (mm/year)">
                  <Input type="number" placeholder="1200" value={form.average_rain_fall_mm_per_year} onChange={(e) => setForm({ ...form, average_rain_fall_mm_per_year: e.target.value })} className="rounded-xl bg-white/60" />
                </FormField>
                <FormField icon={FlaskConical} label="Pesticides (Tonnes)">
                  <Input type="number" placeholder="25000" value={form.pesticides_tonnes} onChange={(e) => setForm({ ...form, pesticides_tonnes: e.target.value })} className="rounded-xl bg-white/60" />
                </FormField>
                <FormField icon={Thermometer} label="Avg Temperature (°C)">
                  <Input type="number" step="0.1" placeholder="27.5" value={form.avg_temp} onChange={(e) => setForm({ ...form, avg_temp: e.target.value })} className="rounded-xl bg-white/60" />
                </FormField>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={handlePredict}
                  disabled={loading}
                  className="flex-1 rounded-xl gradient-primary-bg text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02] disabled:opacity-70"
                >
                  {loading ? (
                    <><Zap className="mr-2 h-5 w-5 animate-pulse" /> Predicting…</>
                  ) : (
                    <><Zap className="mr-2 h-5 w-5" /> Predict Yield</>
                  )}
                </Button>
                <Button size="lg" variant="outline" onClick={reset} className="rounded-xl border-primary/30 hover:bg-primary/10">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </Card>

            {/* RESULT */}
            <div id="result" className="lg:col-span-2">
              {loading && (
                <Card className="glass-card flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border-0 p-8">
                  <div className="relative">
                    <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                    <Sprout className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <p className="mt-6 font-semibold">Analyzing agricultural data…</p>
                  <p className="mt-1 text-sm text-muted-foreground">Running Random Forest model</p>
                </Card>
              )}
              {!loading && result && (
                <Card className="glass-card animate-success-pop h-full rounded-3xl border-0 p-6 sm:p-8">
                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-primary">Prediction Successful</span>
                  </div>
                  <h4 className="text-sm text-muted-foreground">Predicted Crop Yield</h4>
                  <div className="mt-3 space-y-3">

                    {/* KG/Hectare */}
                    <div className="rounded-2xl gradient-primary-bg p-5 text-primary-foreground shadow-[var(--shadow-glow)]">
                      <div className="text-xs opacity-80">Primary Output</div>

                      <div className="mt-1 text-3xl font-extrabold">
                        {result.prediction_kg_ha.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>

                      <div className="text-sm opacity-90">
                        kg / hectare
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-white/60 p-4">
                        <div className="text-xl font-bold">
                          {result.prediction_hg_ha.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          hg / ha
                        </div>
                      </div>

                      <div className="rounded-xl bg-white/60 p-4">
                        <div className="text-xl font-bold">
                          {result.prediction_tonnes_ha.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          tonnes / hectare
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 border-t border-border/50 pt-5">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prediction Confidence</span>
                      <span className="font-bold text-primary">98.57%</span>
                    </div>
                    <Progress value={98.57} className="h-2" />
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-semibold">Random Forest Regressor</span>
                    </div>
                  </div>
                </Card>
              )}
              {!loading && !result && (
                <Card className="glass-card flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border-0 p-8 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-4 font-semibold">Ready to predict</p>
                  <p className="mt-1 text-sm text-muted-foreground">Fill the form and click Predict Yield</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE IMPORTANCE */}
      <section className="px-4 py-16 sm:px-6" data-aos="fade-right">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-bold sm:text-4xl">Feature Importance</h3>
            <p className="mt-3 text-muted-foreground">What drives the model's predictions</p>
          </div>
          <Card className="glass-card rounded-3xl border-0 p-6 sm:p-8">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={FEATURE_DATA} layout="vertical" margin={{ left: 20, right: 40 }}>
                <XAxis type="number" domain={[0, 70]} tick={{ fill: "oklch(0.48 0.03 140)" }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fill: "oklch(0.24 0.04 145)", fontWeight: 500 }} />
                <Tooltip
                  cursor={{ fill: "oklch(0.52 0.14 148 / 0.08)" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.9 0.02 130)", background: "white" }}
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, "Importance"]}
                />
                <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                  {FEATURE_DATA.map((f, i) => (
                    <Cell key={i} fill={f.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </section>

      {/* MODEL PERFORMANCE */}
      <section className="px-4 py-16 sm:px-6" data-aos="zoom-in">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-bold sm:text-4xl">Model Performance</h3>
            <p className="mt-3 text-muted-foreground">Comparing R² scores across trained models</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {MODELS.map((m) => (
              <Card
                key={m.name}
                className={`glass-card relative overflow-hidden rounded-2xl border-0 p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] ${m.best ? "ring-2 ring-primary" : ""}`}
              >
                {m.best && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full gradient-primary-bg px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                    <Award className="h-3 w-3" /> Best
                  </div>
                )}
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-4 text-sm font-medium text-muted-foreground">{m.name}</div>
                <div className="mt-2 text-3xl font-extrabold gradient-text">{m.score}%</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary/10">
                  <div className="h-full rounded-full gradient-primary-bg" style={{ width: `${m.score}%` }} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">R² Score</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="px-4 py-16 sm:px-6" data-aos="fade-left">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-bold sm:text-4xl">Project Workflow</h3>
            <p className="mt-3 text-muted-foreground">From raw dataset to accurate prediction</p>
          </div>
          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
              {WORKFLOW.map((w, i) => (
                <div key={w.label} className="relative">
                  <Card className="glass-card group h-full rounded-2xl border-0 p-5 text-center transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-primary-bg text-primary-foreground shadow-[var(--shadow-soft)] transition-transform group-hover:rotate-6">
                      <w.icon className="h-6 w-6" />
                    </div>
                    <div className="mt-3 text-xs font-bold text-primary">Step {i + 1}</div>
                    <div className="mt-1 text-sm font-semibold">{w.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{w.desc}</div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" data-aos="fade-up" className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Card className="glass-card overflow-hidden rounded-3xl border-0 p-8 sm:p-12">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary-bg">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold sm:text-3xl">About the Project</h3>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              This project predicts crop yield using Machine Learning by analyzing agricultural
              and environmental factors such as <strong className="text-foreground">crop type, rainfall, pesticide usage,
                temperature, location,</strong> and cultivation year.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              The best-performing model is <strong className="text-primary">Random Forest Regressor</strong> with an
              R² score of <strong className="text-primary">98.57%</strong>, providing accurate and reliable yield forecasts.
            </p>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer data-aos="fade-up" className="mt-12 border-t border-border/50 bg-white/40 px-4 py-12 backdrop-blur-md sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl gradient-primary-bg">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-bold">Crop Yield Prediction</div>
                <div className="text-xs text-muted-foreground">ML-powered agricultural intelligence</div>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-3 text-sm font-bold">Created by</div>
            <div className="text-lg font-semibold">Elango S & Sarukesh M</div>
            <div className="text-sm text-muted-foreground">Artificial Intelligence & Data Science</div>
          </div>
          <div>
            <div className="mb-3 text-sm font-bold">Connect</div>
            <div className="flex gap-3">
              {[
                { icon: FaGithub, href: "https://github.com/Elango-2005", label: "GitHub" },
                { icon: FaLinkedin, href: "https://www.linkedin.com/in/elango-selvaraj/", label: "LinkedIn" },
                { icon: Mail, href: "mailto:elangoselvaraj372@gmail.com", label: "Email" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={l.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white/60 text-foreground transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                >
                  <l.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Crop Yield Prediction · Built with React, TypeScript & Machine Learning
        </div>
      </footer>
    </div>
  );
}

function FormField({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </Label>
      {children}
    </div>
  );
}
