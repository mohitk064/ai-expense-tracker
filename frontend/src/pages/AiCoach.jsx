import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BrainCircuit,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";

import { getAiFinancialAdvice } from "../services/AiCoachService";

export default function AiCoach() {

  const AI_CACHE_KEY = "expenseai-ai-coach";
  const AI_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const REFRESH_COOLDOWN = 30; // seconds
  const navigate = useNavigate();

  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);


  async function loadAdvice(forceRefresh = false) {
    try {
      setLoading(true);

      if (!forceRefresh) {
        const cached = sessionStorage.getItem(AI_CACHE_KEY);

        if (cached) {
          try {
            const parsedCache = JSON.parse(cached);

            const isFresh =
              Date.now() - parsedCache.timestamp <
              AI_CACHE_DURATION;

            if (isFresh && parsedCache.data) {
              setAdvice(parsedCache.data);
              return;
            }

            sessionStorage.removeItem(AI_CACHE_KEY);
          } catch {
            sessionStorage.removeItem(AI_CACHE_KEY);
          }
        }
      }

      const result = await getAiFinancialAdvice();

      setAdvice(result);

      sessionStorage.setItem(
        AI_CACHE_KEY,
        JSON.stringify({
          data: result,
          timestamp: Date.now(),
        })
      );

      setCooldownSeconds(REFRESH_COOLDOWN);
    } catch (error) {
      console.error(
        "Failed to generate AI advice:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Unable to generate AI financial advice"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdvice();
  }, []);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCooldownSeconds((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  function handleRefresh() {
    if (cooldownSeconds > 0) {
      toast.error(
        `Please wait ${cooldownSeconds} seconds before refreshing again`
      );
      return;
    }

    loadAdvice(true);
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 transition-colors dark:bg-gray-950 sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <BrainCircuit size={28} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  AI Financial Coach
                </h1>

                <Sparkles
                  size={20}
                  className="text-blue-500"
                />
              </div>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Personalized insights based on your spending
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : advice ? (
          <div className="space-y-6">

            {/* Summary */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Sparkles size={20} />
                </div>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Summary
                </h2>
              </div>

              <p className="leading-7 text-gray-700 dark:text-gray-300">
                {advice.summary}
              </p>
            </section>

            <div className="grid gap-6 md:grid-cols-2">

              {/* Insights */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-amber-100 p-2.5 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <Lightbulb size={20} />
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Key Insights
                  </h2>
                </div>

                <div className="space-y-4">
                  {advice.insights?.map(
                    (insight, index) => (
                      <div
                        key={index}
                        className="flex gap-3"
                      >
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                          {index + 1}
                        </div>

                        <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                          {insight}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </section>

              {/* Recommendations */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Target size={20} />
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recommended Actions
                  </h2>
                </div>

                <div className="space-y-4">
                  {advice.recommendations?.map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="flex gap-3"
                      >
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          {index + 1}
                        </div>

                        <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                          {recommendation}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </section>

            </div>

            {/* Regenerate */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading || cooldownSeconds > 0}
                className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />

                {loading
                  ? "Generating..."
                  : cooldownSeconds > 0
                    ? `Refresh in ${cooldownSeconds}s`
                    : "Refresh Insights"}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 dark:text-gray-600">
              AI-generated guidance based on your recorded expenses.
              Review financial decisions independently.
            </p>

          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
            <BrainCircuit
              size={42}
              className="mx-auto text-gray-400"
            />

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Unable to generate financial insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/10">
        <BrainCircuit
          size={26}
          className="animate-pulse text-blue-600 dark:text-blue-400"
        />
      </div>

      <h2 className="mt-5 font-semibold text-gray-900 dark:text-white">
        Analyzing your spending
      </h2>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        ExpenseAI is reviewing your spending patterns...
      </p>

    </div>
  );
}