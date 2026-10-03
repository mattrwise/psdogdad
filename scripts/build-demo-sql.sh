#!/usr/bin/env bash
# Joins the /supabase setup files, in order, into ONE file you paste into the
# DEMO project's SQL Editor. It also swaps the live admin email for
# admin@example.com so the live address is not baked into the demo database.
# Never run the output against the live project.
set -euo pipefail
cd "$(dirname "$0")/../supabase"
out="../demo-setup.sql"
: > "$out"
for f in setup events-setup 01-security-hardening 02-messaging 03-message-edits \
         04-message-deletes 05-conversations-and-gallery 06-drop-dead-notify-column \
         event-proposals 07-forum-posts 07-guest-rsvps pro-listings pro-accounts \
         resource-suggestions; do
  printf '\n-- ===== %s.sql =====\n' "$f" >> "$out"
  sed 's/psmattreid@gmail.com/admin@example.com/g' "$f.sql" >> "$out"
done
echo "Wrote demo-setup.sql ($(wc -l < "$out") lines). Paste it into the DEMO Supabase SQL Editor."
