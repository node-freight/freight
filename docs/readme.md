--url FREIGHT-URL=
#
--keep-updated # Refresh automatically.
--npm-rebuild
--npm-install
--bower-install
--cache-clear
--queue-priority=[low, normal, medium, high, critical]
--bower-only
--npm-only
--fetch-only # Tries to get the cache, doesn't create one if missing.
# 
--npm-production
--npm-development-only
#
--api-key=
--registry
--api-to-create? ### require api to read and write or just to write?
--tag ### tag the cache with some tag so you can diff between the same name but diff branch?
# --check-only ## if exists , don't download.
# --npm-dedupe ## run npm dedupe dup dup dup.
# 