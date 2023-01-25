import time
import urllib.request
from contextlib import closing

outputFilePath = input("Output file path: ")
pat = input("String to match: ")

output = open(outputFilePath, "a")

st = time.time()
with closing(urllib.request.urlopen('ftp://test:test@192.168.1.6/Thunderbird.log')) as r:
    with open('Thunderbird.log', 'r') as inF:
        for i, line in enumerate(inF):
            if pat in line:
                output.write(line)
output.close()
et = time.time()

print("Elapsed time: ", et - st)

# urllib.request.urlretrieve('ftp://test:test@192.168.1.6/HDFS.log', 'HDFS.log')
# blk_-774246298521956028


# inputFilePath = input("Input file path: ")
# outputFilePath = input("Output file path: ")
# pat = input("String to match: ")

# st = time.time()
# output = open(outputFilePath, "a")
# with open(inputFilePath, "r") as inF:
#     for line in inF:
#         if pat in line:
#             output.write(line)
# output.close()

# et = time.time()

# print("Elapsed time: ", et - st)