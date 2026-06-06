"""Einheitlicher LLM-Client — OpenAI (GPT/Codex) oder Anthropic."""
import os
from dotenv import load_dotenv

load_dotenv()

SYSTEM_JSON = "Antworte NUR mit gültigem JSON, ohne Markdown oder Erklärungen."


def provider():
    if os.environ.get("LLM_PROVIDER"):
        return os.environ["LLM_PROVIDER"]
    if os.environ.get("OPENAI_API_KEY"):
        return "openai"
    return "anthropic"


def complete(prompt, max_tokens=600, system=None):
    instructions = system or SYSTEM_JSON
    if provider() == "openai":
        return _openai(prompt, max_tokens, instructions)
    return _anthropic(prompt, max_tokens, instructions)


def _openai(prompt, max_tokens, instructions):
    from openai import OpenAI

    client = OpenAI()
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    try:
        resp = client.responses.create(
            model=model,
            instructions=instructions,
            input=prompt,
            max_output_tokens=max_tokens,
        )
        return resp.output_text
    except Exception:
        resp = client.chat.completions.create(
            model=model,
            max_tokens=max_tokens,
            messages=[
                {"role": "system", "content": instructions},
                {"role": "user", "content": prompt},
            ],
        )
        return resp.choices[0].message.content or ""


def _anthropic(prompt, max_tokens, instructions):
    import anthropic

    client = anthropic.Anthropic()
    model = os.environ.get("CLAUDE_MODEL", "claude-sonnet-4-6")
    msg = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        system=instructions,
        messages=[{"role": "user", "content": prompt}],
    )
    return msg.content[0].text


def parse_json(text):
    text = text.strip().strip("`")
    if text.startswith("json"):
        text = text[4:].strip()
    import json

    return json.loads(text)
