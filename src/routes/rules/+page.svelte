<script lang="ts">
	import Ads from '$lib/components/ads.svelte';
	import BigTitle from '$lib/components/bigTitle.svelte';
	import { locale } from 'svelte-i18n';
</script>

<svelte:head>
	<title>Luật - Demon List VN</title>
</svelte:head>
{#if $locale == 'vi'}
	<BigTitle value="Luật" description="Đọc luật" />
{:else}
	<BigTitle value="Rules" description="Read the rules" />
{/if}
<Ads unit="leaderboard" />
<div class="wrapper">
	{#if $locale == 'vi'}
		<h2>Quy tắc chung</h2>
		<ul>
			<li>
				Chỉ những người chơi có quốc tịch Việt Nam hoặc có dòng máu Việt Nam mới có thể gửi record.
			</li>
			<li>Record không có FPS counter, clicks và raw footage sẽ bị từ chối ngay lập tức.</li>
			<li>Record phải đạt yêu cầu tiến độ tối thiểu của level để được chấp nhận.</li>
			<li>
				Record sử dụng hack không được phép hoặc đường tắt bí mật (bỏ qua những phần khó nhất của
				level), hoặc ăn cắp từ người khác sẽ không được chấp nhận. Khuyến nghị kiểm tra <a
					href="https://docs.google.com/spreadsheets/d/1evE4nXATxRAQWu2Ajs54E6cVUqHBoSid8I7JauJnOzg/edit?usp=sharing"
					>danh sách hack được phép từ Pointercrate</a
				>.
			</li>
			<li>
				Record không hiển thị màn hình kết thúc trong game sau khi hoàn thành level sẽ không được
				chấp nhận.
			</li>
			<li>Record nên có sẵn trên YouTube (công khai hoặc không công khai).</li>
			<li>
				Người chơi được phép sửa lỗi do tần số làm mới khác nhau hoặc thay đổi vật lý trong game gây
				ra.
			</li>
			<li>
				Nếu bạn sử dụng phiên bản LDM tùy chỉnh, bạn phải cung cấp ID của level LDM trong phần bình
				luận khi nộp. Nếu không, bản nộp của bạn sẽ bị từ chối ngay lập tức.
			</li>
			<li>
				Nếu bạn bị ban khỏi nhóm Facebook GDVN hoặc CDGDVN, record của bạn sẽ bị từ chối cho đến khi
				bạn được unban.
			</li>
		</ul>
		<h2>Luật Demon List</h2>
		<ul>
			<li>Tất cả level phải là insane hoặc extreme demon tại thời điểm gửi.</li>
			<li>Tất cả record phải có độ phân giải 360p 25fps trở lên</li>
			<li>Raw là bắt buộc cho tất cả record. (trừ Insane Demon)</li>
			<li>
				Lưu ý: Insane Demon sẽ không nhận được rating, nhưng submission vẫn được chấp nhận cho mục
				đích lưu trữ.
			</li>
		</ul>
		<h2>Luật Featured List</h2>
		<ul>
			<li>
				Tất cả level phải là rated demon, được tạo và upload bởi người Việt Nam (hoặc có ít nhất 50%
				đóng góp của người Việt Nam).
			</li>
		</ul>
		<h2>Rating</h2>
		<ul>
			<li>Tổng quan:</li>
			<ul>
				<li>Rating là chỉ số đại diện cho tiềm năng của người chơi.</li>
				<li>
					Rating dựa trên thành tích tốt nhất của người chơi và thành tích trên các level khác trong
					Demon List.
				</li>
			</ul>
			<li>Quy tắc:</li>
			<ul>
				<li>Rating chỉ áp dụng cho Demon List và Contest Event.</li>
				<li>Tài khoản bị ban và ẩn sẽ không có rating.</li>
			</ul>
			<li>Phân phối Rating Demon List:</li>
			<ul>
				<li>C: > 0</li>
				<li>B: >= 500</li>
				<li>A: >= 1000</li>
				<li>Specialist: >= 1500</li>
				<li>Expert: >= 2000</li>
				<li>Candidate Master: >= 2500</li>
				<li>Master: >= 3000</li>
				<li>Grandmaster: >= 4000</li>
				<li>Legendary Grandmaster: >= 5000</li>
				<li>Ascended Grandmaster: >= 6000</li>
			</ul>
			<li>Phân phối Rating Contest:</li>
			<ul>
				<li>Plastic: > 0</li>
				<li>Iron: >= 200</li>
				<li>Silver: >= 500</li>
				<li>Gold: >= 1000</li>
				<li>Diamond: >= 1500</li>
				<li>Challenger: >= 2000</li>
				<li>Challenger First Class: >= 2500</li>
				<li>Elite: >= 3000</li>
				<li>Global Elite: >= 3500</li>
			</ul>
		</ul>
	{:else}
		<h2>General rules</h2>
		<ul>
			<li>
				Only the players who have Vietnamese citizenship or Vietnamese bloodline can submit records.
			</li>
			<li>Records without FPS counter, clicks and raw footage will be rejected immediately.</li>
			<li>Records must reach minimum progress requirement of any level to be accepted.</li>
			<li>
				Records using disallowed hacks or secret routes (bypassing the hardest parts of the level),
				or stolen from others will not be accepted. It is recommended to check <a
					href="https://docs.google.com/spreadsheets/d/1evE4nXATxRAQWu2Ajs54E6cVUqHBoSid8I7JauJnOzg/edit?usp=sharing"
					>the list of allowed hacks from Pointercrate</a
				>.
			</li>
			<li>
				Records not showing the in-game endscreen after completing the level will not be accepted.
			</li>
			<li>Records should be available on YouTube (public or unlisted).</li>
			<li>
				Players are allowed to fix bugs that are caused by varying refresh rates or in-game physics
				changes.
			</li>
			<li>
				If you use a custom LDM version, you must show the LDM level's ID in the comment section
				when submitting. Otherwise, your submission will be rejected immediately.
			</li>
			<li>
				If you get banned from the GDVN or CDGDVN facebook group, your record will be rejected until
				you get unbanned.
			</li>
		</ul>
		<h2>Demon List rule</h2>
		<ul>
			<li>All levels must be insane or extreme demons at the time of submission..</li>
			<li>All records must be 360p 25fps or better</li>
			<li>Raw is required for all records. (except for Insane Demon)</li>
			<li>
				Note: Insane Demons will not receive a rating, but submissions are still accepted for
				archival purposes.
			</li>
		</ul>
		<h2>Featured List rule</h2>
		<ul>
			<li>
				All levels must be rated demons, created and uploaded by the Vietnamese (or having at least
				50% Vietnamese contribution).
			</li>
		</ul>
		<h2>Rating</h2>
		<ul>
			<li>Overview:</li>
			<ul>
				<li>Rating is a metric represents player potential.</li>
				<li>
					Rating is based on player's best performance and performance on other levels on Demon
					List.
				</li>
			</ul>
			<li>Rules:</li>
			<ul>
				<li>Rating is only applied to Demon List and Contest Event.</li>
				<li>Banned and hidden accounts will be unrated.</li>
			</ul>
			<li>Demon List Rating distribution:</li>
			<ul>
				<li>C: > 0</li>
				<li>B: >= 500</li>
				<li>A: >= 1000</li>
				<li>Specialist: >= 1500</li>
				<li>Expert: >= 2000</li>
				<li>Candidate Master: >= 2500</li>
				<li>Master: >= 3000</li>
				<li>Grandmaster: >= 4000</li>
				<li>Legendary Grandmaster: >= 5000</li>
				<li>Ascended Grandmaster: >= 6000</li>
			</ul>
			<li>Contest Rating distribution:</li>
			<ul>
				<li>Plastic: > 0</li>
				<li>Iron: >= 200</li>
				<li>Silver: >= 500</li>
				<li>Gold: >= 1000</li>
				<li>Diamond: >= 1500</li>
				<li>Challenger: >= 2000</li>
				<li>Challenger First Class: >= 2500</li>
				<li>Elite: >= 3000</li>
				<li>Global Elite: >= 3500</li>
			</ul>
		</ul>
	{/if}
</div>

<style lang="scss">
	.wrapper {
		padding-inline: 100px;

		h2 {
			display: block;
			font-size: 1.5em;
			margin-top: 0.83em;
			margin-bottom: 0.83em;
			margin-left: 0;
			margin-right: 0;
			font-weight: bold;
		}

		ul {
			list-style: initial;
			margin: initial;
			padding: 0 0 0 40px;
		}

		li {
			display: list-item;
		}
	}

	@media screen and (max-width: 900px) {
		.wrapper {
			padding-inline: 15px;
		}
	}
</style>
